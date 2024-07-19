const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const  OpenAIApi  = require('openai'); // Import directly
const fs = require('fs');

const app = express();
const port = 3001;

// Initialize OpenAI client
const openai = new OpenAIApi({
    apiKey: 'xyz', /
});

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pass OpenAI client to routes
app.use((req, res, next) => {
    req.openai = openai;
    next();
});

// Use the routes
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
