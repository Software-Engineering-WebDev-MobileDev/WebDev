const bodyParser = require('body-parser');
const express = require('express');

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
    } catch (e) {
        if (e instanceof TypeError) {
            res.status(400).send(
                {
                    status: "error",
                    reason: "Bad request"
                }
            );
        }
        else {
            res.status(500).send(
                {
                    status: "error",
                    reason: "The server is having a bad day. Please send encouraging words."
                }
            );
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
            res.status(400).send(
                {
                    status: "error",
                    reason: "Bad request"
                }
            );
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            res.status(400).send(
                {
                    status: "error",
                    reason: "Bad request"
                }
            );
        }
        else {
            res.status(500).send(
                {
                    status: "error",
                    reason: "The server is having a bad day. Please send encouraging words."
                }
            );
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
            res.status(400).send(
                {
                    status: "error",
                    reason: "Bad request"
                }
            );
        }
        else {
            res.status(500).send(
                {
                    status: "error",
                    reason: "The server is having a bad day. Please send encouraging words."
                }
            );
        }
    }
});

module.exports = app;