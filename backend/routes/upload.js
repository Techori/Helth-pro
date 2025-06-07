const express = require('express');
const multer = require('multer');
const FileMetadata = require('../models/FileMetadata');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { documentType, validUntil, description } = req.body;

    const fileMetadata = new FileMetadata({
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      documentType: documentType, // Add documentType
      validUntil: new Date(validUntil), // Add validUntil and convert to Date
      description: description, // Add description
    });

    await fileMetadata.save();
    res.status(201).json({ message: 'File uploaded successfully', file: fileMetadata });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error });
  }
});

module.exports = router;