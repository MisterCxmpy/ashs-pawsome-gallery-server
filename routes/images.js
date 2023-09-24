const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const router = express.Router();

const drive = google.drive({
  version: 'v3',
  auth: process.env.KEY,
});

router.get('/images', async (req, res) => {
  try {
    let allFiles = [];

    let nextPageToken = null;
    do {
      const response = await drive.files.list({
        q: `'${process.env.ADDRESS}' in parents`,
        fields: 'files(name, webViewLink), nextPageToken',
        pageSize: 1000,
        pageToken: nextPageToken,
      });

      const files = response.data.files.map((item) => {
        const urlParts = item.webViewLink.split('/');
        const fileId = urlParts[urlParts.length - 2];
        const fileExtension = item.name.split('.').pop();
        return { id: fileId, format: fileExtension };
      });

      allFiles = allFiles.concat(files);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    res.json(allFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
