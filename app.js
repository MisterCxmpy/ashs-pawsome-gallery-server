const express = require('express');
const { google } = require('googleapis');
const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: 'https://ashs-pawsome-gallery.netlify.app' || "http://localhost:5173" }))

const drive = google.drive({
  version: 'v3',
  auth: process.env.KEY
});

app.get('/getImages', async (req, res) => {
  try {
    const response = await drive.files.list({
      q: `'${process.env.ADDRESS}' in parents`,
      fields: 'files(name, webViewLink)',
    });

    const webViewLinks = response.data.files.map(item => {
      const urlParts = item.webViewLink.split('/');
      const fileId = urlParts[urlParts.length - 2];
      const fileExtension = item.name.split('.').pop();
      return { id: fileId, format: fileExtension };
    });
    
    res.json(webViewLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
