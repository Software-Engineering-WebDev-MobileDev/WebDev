const bodyParser = require('body-parser');
const express = require('express');

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.get("/route", (req, res) => {
   // ...
});

module.exports = app;