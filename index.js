const express = require('express');
const cors = require('cors');
require('dotenv').config();
const imagesRoute = require("./routes/images");

const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  'https://ashs-pawsome-gallery.netlify.app',
  'http://localhost:5173',
];

app.use(cors({ origin: allowedOrigins }));

app.use('/', imagesRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
