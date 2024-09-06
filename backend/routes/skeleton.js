const bodyParser = require('body-parser');
const express = require('express');
const {return_500, return_400} = require('./codes')

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.get("/route", (req, res) => {
   try {
       /* Parse query params
        *
        * Query string example:
        * const product = req.query["product"];
        *
        * Body example:
        * const product = req.body["product"];
        *
        * From here, you must validate the input. If a parameter is undefined, and you have not set defaults, then a
        * TypeError will be thrown and caught below.
        *
        *
        *
        * Next, you will want to perform a query to the database. For your convenience, a database class is provided as
        * an abstraction on top of mssql. It is imported and initialized at the top of this file.
        * It may be used as follows:
        *
        * database.executeQuery(
        *   `<your-query`
        * ).then((result) => {
        *   // Do something with the result
        * }).catch((e) => {
        *   if (e instanceof RequestError) {
        *       console.log(e);
        *       console.log("If this is thrown in the dev environment, you likely wrote a bad SQL query.");
        *       return_500(res);
        *   }
        *   else {
        *       console.log(e);
        *       return_500(res);
        *   }
        * });
        *
        *
        *
        * Returning a response:
        * `res` is the response object you will use to respond to a query and can be used as follows:
        *
        * res.status("<HTTP-code>").send(
        *   {
        *       status: "success",
        *       // Rest of the JSON body...
        *   }
        * );
        */
   }
   catch (e) {
       if (e instanceof TypeError) {
           return_400(res, "Invalid query parameters");
       }
       else {
           return_500(res);
       }
   }
});

module.exports = app;