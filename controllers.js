const fs = require('fs');
const db = require('./db');

// Function to analyze resumes using OpenAI all
const analyzeResume = async (openai, filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const prompt = `Analyze the following resume and provide strengths, weaknesses, and suggestions for improvement:\n\n${fileContent}`;

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo',
            prompt: prompt,
            max_tokens: 500,
            temperature: 0.5,
        });

        const analysisResult = response.choices[0].text.trim();
        const [strengths, weaknesses, suggestions] = analysisResult.split('\n').map(line => line.trim());

        return { strengths, weaknesses, suggestions };
    } catch (error) {
        console.error('Error analyzing resume with OpenAI:', error);
        throw new Error('Error analyzing resume.');
    }
};

// Function to generate job descriptions using OpenAI
const generateDescription = async (openai, position) => {
    try {
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo',
            prompt: `Generate a job description for the following position: ${position}`,
            max_tokens: 150,
        });

        return response.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating description with OpenAI:', error);
        throw new Error('Error generating description.');
    }
};

// Controller functions
const postGenerateDescription = async (req, res) => {
    const { position } = req.body;

    if (!position) {
        return res.status(400).send('Position is required.');
    }

    try {
        const description = await generateDescription(req.openai, position);

        // Save generated description to the database
        const query = 'INSERT INTO job_descriptions (position, description) VALUES (?, ?)';
        db.query(query, [position, description], (err, result) => {
            if (err) {
                console.error('Error saving description:', err);
                return res.status(500).send('Error saving description.');
            }
            res.send({ description });
        });
    } catch (error) {
        res.status(500).send('Error generating description.');
    }
};

const postUploadResume = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const userId = 1; // Replace this with the actual user ID from your application
    const filePath = req.file.path;

    try {
        // Save resume file path and user ID to the database
        const query = 'INSERT INTO resumes (user_id, file_path) VALUES (?, ?)';
        db.query(query, [userId, filePath], (err, result) => {
            if (err) {
                console.error('Error saving resume:', err);
                return res.status(500).send('Error saving resume.');
            }

            const resumeId = result.insertId;

            // Analyze the resume
            analyzeResume(req.openai, filePath).then(analysisResult => {
                // Save analysis result to the database
                const analysisQuery = 'INSERT INTO resume_analysis (resume_id, strengths, weaknesses, suggestions) VALUES (?, ?, ?, ?)';
                db.query(analysisQuery, [resumeId, analysisResult.strengths, analysisResult.weaknesses, analysisResult.suggestions], (analysisErr, analysisResult) => {
                    if (analysisErr) {
                        console.error('Error saving resume analysis:', analysisErr);
                        return res.status(500).send('Error saving resume analysis.');
                    }

                    // Send analysis result back to client
                    res.send(analysisResult);
                });
            }).catch(error => {
                console.error('Error analyzing resume:', error);
                res.status(500).send('Error analyzing resume.');
            });
        });
    } catch (error) {
        res.status(500).send('Error processing resume.');
    }
};

module.exports = {
    postGenerateDescription,
    postUploadResume
};
