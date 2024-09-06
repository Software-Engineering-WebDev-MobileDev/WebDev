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

app.get("/inventory", (req, res) => {
    try {
        const page = req.query['page'];

        res.status(200).send({
            status: "success",
            page: 1,
            items: [
                {
                    name: "butter",
                    count: 200,
                }
            ]
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Bad request");
        }
        else {
            return_500(res);
        }
    }
});

app.get("/inventory_item", (req, res) => {
    try {
        const item = req.query['item'];

        res.status(200).send({
            status: "success",
            name: "butter",
            count: 200,
            expiration_date: "1724797536",
            supplier_info: "data",
            order_info: "how do I order this?"
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query string");
        }
        else {
            return_500(res);
        }
    }
});

module.exports = app;