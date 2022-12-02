// basic packages
const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser')

// other packages
const tf = require('@tensorflow/tfjs');
const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage');
const { Stream } = require('stream');
const BasicPitch = require('@spotify/basic-pitch')

// local modules
const getStems = require('./functions/getStems').getStems

// constants
const AWS_REGION = "US East (Ohio) us-east-2"

// setup
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const s3Client = new S3Client({ 
  region: AWS_REGION,
  accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
});


// Have Node serve files from our Built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
// All other GET requests not handles will return our React app

app.post('/api/process', async (req, res) => {

  try {
    
    const awsUrl = req.body.awsUrl  
    
    let stems = await getStems(`${process.env.MOISES_API_KEY, awsUrl }`)
    console.log("here")

    console.log(stems);

  } catch(err) {
    res.send(err)
  }

});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

