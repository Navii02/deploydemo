const express = require('express');
const path = require('path');

const router = express.Router();

// Define the folder path where your images are stored
const imagesFolderPath = path.join(__dirname, 'backend-images');

// Endpoint to retrieve the image URLs
router.get('/images', (req, res) => {
  const fs = require('fs');
  fs.readdir(imagesFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading images folder:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);
    });

    const imageUrls = imageFiles.map((file) => {
      return `/api/images/${file}`;
    });

    res.json(imageUrls);
  });
});

module.exports = router;
