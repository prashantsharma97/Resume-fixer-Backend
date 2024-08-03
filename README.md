# Resume Fixer using AI (OpenAi)

This is a web application that allows users to upload their resumes, generate job descriptions for specific positions, and receive feedback on their resumes, including strengths, weaknesses, and suggestions. The backend is built with Node.js and Express, and the frontend uses React.js. The data is stored in a MySQL database.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload resume files
- Generate job descriptions for various positions
- Analyze resumes to identify strengths, weaknesses, and suggestions

## Requirements

- Node.js
- MySQL
- npm (Node Package Manager)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/resume-fixer.git
    cd resume-fixer
    ```

2. **Install the dependencies:**

    ```bash
    npm install
    ```

3. **Set up the MySQL database:**

    Create a MySQL database and update the `db.js` file with your database credentials.

## Database Setup

1. **Create the database and tables:**

    ```sql
    CREATE DATABASE IF NOT EXISTS resume_db;

    USE resume_db;

    CREATE TABLE IF NOT EXISTS job_descriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        position VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resume_analysis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        strengths TEXT NOT NULL,
        weaknesses TEXT NOT NULL,
        suggestions TEXT NOT NULL,
        analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id)
    );
    ```

2. **Update the `db.js` file with your database credentials:**

    ```javascript
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root', // Use your MySQL username
        password: '', // Use your MySQL password
        database: 'resume_db' // Use your database name
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.stack);
            return;
        }
        console.log('Connected to MySQL as ID', connection.threadId);
    });

    module.exports = connection;
    ```

## Running the Application

1. **Start the backend server:**

    ```bash
    npm run dev
    ```

    This will start the server with `nodemon` for automatic restarts on code changes.

2. **Start the frontend:**

    Navigate to the frontend directory and start the React development server:

    ```bash
    cd frontend
    npm install
    npm start
    ```

## Usage

- Navigate to `http://localhost:3000` to access the application.
- Select the job you are applying for and generate a job description.
- Upload your resume to receive feedback including strengths, weaknesses, and suggestions.

## Folder Structure

resume-fixer/
├── controllers/
│ └── controllers.js
├── routes/
│ └── routes.js
├── uploads/
│ └── (uploaded resume files)
├── db.js
├── server.js
├── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ └── ResumeForm.js
│ │ ├── App.js
│ │ ├── index.js
│ ├── public/
│ └── package.json
└── README.md

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License.

