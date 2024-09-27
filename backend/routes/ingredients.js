const bodyParser = require('body-parser');
const express = require('express');
const {v4} = require('uuid');
const {return_500, return_400, return_498} = require('./codes')
const isNumber = (v) => typeof v === "number" || (typeof v === "string" && Number.isFinite(+v))

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.get("/ingredients", (req, res) => {
    try {
        const session_id = req.header('session_id');

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(
                    `SELECT *
                     FROM tblIngredients AS ing
                              INNER JOIN tblInventory AS inv ON ing.InventoryID = inv.InventoryID`
                ).then((result) => {
                    if (result.rowsAffected[0] > 0) {
                        res.status(200).send(
                            {
                                status: "success",
                                content: result.recordsets[0]
                            }
                        );
                    }
                    else {
                        res.status(503).send(
                            {
                                status: "error",
                                reason: "No ingredients in the database. Try creating some ingredients first"
                            }
                        );
                    }
                }).catch((e) => {
                    console.log(e);
                    return_500(res);
                })
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.log(e);
            return_500(res);
        })
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

app.get("/ingredients_short", (req, res) => {
    try {
        const session_id = req.header('session_id');

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(
                    `SELECT IngredientID, ing.InventoryID, Name, Quantity, UnitOfMeasure
                     FROM tblIngredients AS ing
                              INNER JOIN tblInventory AS inv ON ing.InventoryID = inv.InventoryID`
                ).then((result) => {
                    if (result.rowsAffected[0] > 0) {
                        res.status(200).send(
                            {
                                status: "success",
                                content: result.recordsets[0]
                            }
                        );
                    }
                    else {
                        res.status(503).send(
                            {
                                status: "error",
                                reason: "No ingredients in the database. Try creating some ingredients first"
                            }
                        );
                    }
                }).catch((e) => {
                    console.log(e);
                    return_500(res);
                })
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.log(e);
            return_500(res);
        })
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

app.get("/ingredient", (req, res) => {
    try {
        const session_id = req.header('session_id');
        const ingredient_id = req.header('ingredient_id');

        if (!ingredient_id.match(/^[0-9A-Za-z]{32}$/)) {
            return_400(res, "Invalid ingredient_id format");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `SELECT *
                         FROM tblIngredients
                         WHERE IngredientID = '${ingredient_id}'`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(200).send(
                                {
                                    status: "success",
                                    content: result.recordsets[0][0]
                                }
                            );
                        }
                        else {
                            res.status(503).send(
                                {
                                    status: "error",
                                    reason: "No ingredients in the database. Try creating some ingredients first"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            });
        }
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

app.post("/ingredient", (req, res) => {
    try {
        const session_id = req.header('session_id');
        const inventory_id = req.header('inventory_id');
        const ingredient_id = database.gen_uuid();
        const quantity = req.header("quantity");
        const unit_of_measurement = req.header("unit_of_measurement");

        //const description = req.header("description");
        //const category = req.header("category");
        //const measurement = req.header("measurement");
        //const max_amount = req.header("max_amount");
        //const reorder_amount = req.header("reorder_amount");
        //const min_amount = req.header("min_amount");

        // Make sure that relevant sentence-like info can be inserted into the DB without SQL injection
        const sentence_regex = /^[\w\s,.!?'"(){}\[\]:-=]{1,50}(?!--|;)$/;
        // The biggest floating point number that will be stored by the database
        const decimal_10whole_2fraction_max = 9_999_999_999.99;

        // TODO: Check if the unit is in a list of metric units or something like that
        if (!unit_of_measurement.match(sentence_regex)) {
            return_400(res, "Invalid category contents");
        }
        else if (!inventory_id.match(/^\w{0,32}$/)) {
            return_400(res, "Bad inventory_id format");
        }
        else if (quantity < 0) {
            return_400(res, "Quantity must be positive");
        }
        else if (quantity > decimal_10whole_2fraction_max) {
            return_400(res, "Quantity is too large");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                // Only valid employees should be able to add ingredients
                if (employee_id) {
                    database.executeQuery(
                        `INSERT INTO tblIngredients (IngredientID, InventoryID, Quantity, UnitOfMeasure)
                         VALUES ('${ingredient_id}', '${inventory_id}', ${quantity}, '${unit_of_measurement}')`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(201).send(
                                {
                                    status: "success",
                                    ingredient_id: ingredient_id
                                }
                            );
                        }
                        else {
                            return_400(res, "Invalid or duplicate ingredient");
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.error(e);
                return_500(res);
            });
        }
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

app.delete('/ingredient', (req, res) => {
    try {
        const session_id = req.header('session_id');
        const ingredient_id = req.header("ingredient_id")

        if (!ingredient_id.match(/^[0-9A-Za-z]{32}$/)) {
            return_400(res, "Invalid ingredient_id format");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `DELETE
                         FROM tblIngredients
                         WHERE IngredientID = '${ingredient_id}'`
                    ).then((result) => {
                        if (result.rowsAffected[0] >= 1) {
                            res.status(200).send(
                                {
                                    status: "success"
                                }
                            );
                        }
                        else if (result.rowsAffected[0] === 0) {
                            res.status(404).send(
                                {
                                    status: "error",
                                    reason: "Ingredient not found in the database"
                                }
                            );
                        }
                        else {
                            console.log(`Error: ${JSON.stringify(result)}`);
                            return_500(res);
                        }
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            })
        }
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

app.put('/ingredient', (req, res) => {
    try {
        const session_id = req.header('session_id');
        const ingredient_id = req.header("ingredient_id")
        const description = req.header("description");
        const category = req.header("category");
        const measurement = req.header("measurement");
        const max_amount = req.header("max_amount");
        const reorder_amount = req.header("reorder_amount");
        const min_amount = req.header("min_amount");

        /*
         * For the implementation, I would guess that we will want all columns coming from the frontend. There is
         * already an endpoint to get all of these details currently present in the database, so I feel like we can
         * put the responsibility of filling out those fields on the frontend. It would therefore be advantageous for
         * all the validation from `POST ingredient` to be a function used by both endpoints.
         */

        // TODO: Implement this
        res.status(501).send(
            {
                status: "error",
                reason: "Not implemented yet for MVP"
            }
        )
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
})

module.exports = app;