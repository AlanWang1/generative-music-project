// server/index.js

const tf = require('@tensorflow/tfjs')

const express = require('express');
const path = require('path');
const { nextTick } = require('process');
const axios = require("axios").default;

const PORT = process.env.PORT || 3001;

const app = express();
require('dotenv').config();

// Have Node serve files from our Built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
// All other GET requests not handles will return our React app

// (will allow both the node app and the react app to be served on the same domain)

app.get("/api/requestUploadUrl", (req, res) => {

  var options = {
    method: 'GET',
    url: 'https://developer.moises.ai/api/upload/signed-url',
    headers: {Authorization: process.env.MOISES_API_KEY}
  };
  
  axios.request(options).then(function (response) {
    res.send(response);
  }).catch(function (error) {
    res.send(error);
  });

});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

