const express = require('express');
  const FileMetadata = require('../models/FileMetadata');

  const router = express.Router();

  // List all files
  router.get('/files', async (req, res) => {
    try {
      const files = await FileMetadata.find();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve files', error });
    }
  });

  // Retrieve a specific file
  router.get('/files/:id', async (req, res) => {
    try {
      const file = await FileMetadata.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve file', error });
    }
  });

  // Delete a specific file
  router.delete('/files/:id', async (req, res) => {
    try {
      const file = await FileMetadata.findByIdAndDelete(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete file', error });
    }
  });

  module.exports = router;