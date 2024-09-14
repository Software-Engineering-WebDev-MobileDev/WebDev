const bodyParser = require('body-parser');
const express = require('express');
const {return_500, return_400, return_498} = require('./codes')

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.get("/product_requirements", (req, res) => {
    try {
        const product = req.query['product'];

        res.status(200).send(
            {
                status: "success",
                response: [
                    {
                        item_name: "butter",
                        amount: "2000 lbs"
                    },
                    {
                        item_name: "flour",
                        amount: "1 lb"
                    },
                    {
                        item_name: "yeast",
                        amount: "1 g"
                    }
                ]
            }
        );
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

app.post('/add_product_requirements', (req, res) => {
    try {
        let product = req.body["product"];
        product.json().then((product) => {
                res.status(201).send(
                    {
                        status: "success"
                    }
                );
            }
        ).catch((e) => {
            console.log(e);
            return_400(res);
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

app.delete('/delete_product_requirements', (req, res) => {
    try {
        const product = req.query['product'];

        res.status(200).send({
            status: "success"
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res);
        }
        else {
            return_500(res);
        }
    }
});

module.exports = app;