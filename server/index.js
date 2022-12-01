// server/index.js

const express = require('express');
const path = require('path')

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve files from our Built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
 res.json({message: "Hello from Server"});
});

// All other GET requests not handles will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
// (will allow both the node app and the react app to be served on the same domain)



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

