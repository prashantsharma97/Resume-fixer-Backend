const express = require('express');
const router = express.Router();
const controllers = require('./controllers');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Route to handle resume uploads
router.post('/upload-resume', upload.single('resume'), controllers.postUploadResume);

// Route to generate job descriptions
router.post('/generate-description', controllers.postGenerateDescription);

module.exports = router;
