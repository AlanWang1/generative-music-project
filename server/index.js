// basic packages
const express = require('express');
const path = require('path');

// other packages
const tf = require('@tensorflow/tfjs');
const { fstat } = require('fs');

// local modules
const requestUploadUrl = require('./functions/requestUploadUrl').requestUploadUrl

const PORT = process.env.PORT || 3001;
const app = express();
require('dotenv').config();

// Have Node serve files from our Built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
// All other GET requests not handles will return our React app

app.use('/api/upload', async (req, res) => {

  const query = new URLSearchParams(req.url);
  const fileName = query.get(`/upload?fileName`);
 
  try {

    let tempUploadUrl;
    let tempInputUrl;

    let response = await requestUploadUrl(`${process.env.MOISES_API_KEY}`)
    
    tempInputUrl = response.data.tempInputUrl
    tempUploadUrl = response.data.uploadSignedUrl

    console.log(tempUploadUrl)
    console.log(tempInputUrl)

  } catch(err) {
    res.send(err)
  }

});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

