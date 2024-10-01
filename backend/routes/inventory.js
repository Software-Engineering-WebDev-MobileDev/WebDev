const bodyParser = require('body-parser');
const express = require('express');
const {return_500, return_400, return_498} = require('./codes')
const isNumber = (v) => typeof v === "number" || (typeof v === "string" && Number.isFinite(+v));

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
        // Pagination, default of one page with 20 items
        const page = isNumber(req.header("page")) ? Number(req.header("page")) : 1;
        const page_size = isNumber(req.header("page_size")) ? Number(req.header("page_size")) : 20;
        const session_id = req.header("session_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (page_size > 30) {
            return_400(res, "Invalid page size. Page size must be <= 30");
        }
        else if (page_size < 1) {
            return_400(res, "Invalid page size. Page size must be > 0");
        }
        else if (page < 1) {
            return_400(res, "Page must be >= 1")
        }
        else if (!Number.isInteger(page_size)) {
            return_400(res, "page_size must be an integer");
        }
        else if (!Number.isInteger(page)) {
            return_400(res, "page must be an integer");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `SELECT *
                         FROM tblInventory`
                    ).then((result_rows) => {
                        // Make sure that there are results
                        if (result_rows.rowsAffected > 0) {
                            // Paginate and return the results
                            let inventory_list = result_rows.recordsets[0];
                            res.status(200).send(
                                {
                                    status: "success",
                                    page: page,
                                    page_count: Math.ceil(inventory_list.length / page_size),
                                    content: inventory_list.slice(page * page_size - page_size, page * page_size)
                                }
                            );
                            // Otherwise, we know that there are no inventory items in the database
                        }
                        else {
                            res.status(503).send(
                                {
                                    status: "error",
                                    reason: "No inventory items in the database. Try creating some inventory first"
                                }
                            );
                        }
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.error(e);
                return_500(res);
            })
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            console.error(e);
            return_500(res);
        }
    }
});

app.get("/inventory_item", (req, res) => {
    try {
        const session_id = req.header("session_id");
        const inventory_id = req.header('inventory_id');

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (inventory_id === undefined) {
            return_400(res, "Missing inventory_id in headers");
        }
        else if (!inventory_id.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid inventory_id format")
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `SELECT *
                         FROM tblInventory
                         WHERE InventoryID = '${inventory_id}'`
                    ).then((result) => {
                        if (result.rowsAffected > 0) {
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
                                    reason: "No inventory items in the database. Try creating some users first"
                                }
                            );
                        }
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.error(e);
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

app.post('/inventory_item', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const inventory_id = database.gen_uuid();
        const name = req.header("name");
        let shelf_life = req.header("shelf_life");
        let shelf_life_unit = req.header("shelf_life_unit");
        const reorder_amount = req.header("reorder_amount");
        const reorder_unit = req.header("reorder_unit");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (name === undefined) {
            return_400(res, "Missing name in headers");
        }
        else if (reorder_amount === undefined) {
            return_400(res, "Missing reorder_amount in headers");
        }
        else if (reorder_unit === undefined) {
            return_400(res, "Missing reorder_unit in headers");
        }
        else if (!name.match(/^[\w\s.,*/]{1,50}$/)) {
            return_400(res, "Invalid name characters or length");
        }
        else if (reorder_amount > 9_999_999_999.99) {
            return_400(res, "reorder_amount too large");
        }
        else if (reorder_amount < 0) {
            return_400(res, "reorder_amount must be positive");
        }
        else if (!reorder_unit.match(/^[\w\s.,*/]{1,20}$/)) {
            return_400(res, "Invalid reorder_unit characters or length");
        }
        else if (shelf_life !== undefined && (!isNumber(shelf_life) || !Number.isInteger(Number(shelf_life)))) {
            return_400(res, "Invalid shelf_life");
        }
        else if (shelf_life_unit !== undefined && !shelf_life_unit.match(/^[\w\s.,*/]{1,10}$/)) {
            return_400(res, "Invalid shelf_life_unit");
        }
        else {
            database.sessionToMinimumRollID(session_id, "manager").then((employee_id) => {
                if (employee_id && (
                    shelf_life === undefined ||
                    shelf_life_unit === undefined ||
                    shelf_life === null ||
                    shelf_life_unit === null)
                ) {
                    database.executeQuery(
                        `INSERT INTO tblInventory (InventoryID, Name, ReorderAmount, ReorderUnit)
                         VALUES ('${inventory_id}', '${name}', ${reorder_amount}, '${reorder_unit}')`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(201).send(
                                {
                                    status: "success",
                                    inventory_id: inventory_id
                                }
                            );
                        }
                        else {
                            return_400(res, "Invalid or duplicate inventory item");
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else if (employee_id) {
                    database.executeQuery(
                        `INSERT INTO tblInventory (InventoryID, Name, ShelfLife, ShelfLifeUnit, ReorderAmount,
                                                   ReorderUnit)
                         VALUES ('${inventory_id}', '${name}', ${shelf_life}, '${shelf_life_unit}', ${reorder_amount},
                                 '${reorder_unit}')`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(201).send(
                                {
                                    status: "success",
                                    inventory_id: inventory_id
                                }
                            );
                        }
                        else {
                            return_400(res, "Invalid or duplicate inventory item");
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else {
                    database.sessionActivityUpdate(session_id).then((result) => {
                        if (result) {
                            res.status(403).send(
                                {
                                    status: "error",
                                    reason: "Insufficient permission to use this resource"
                                }
                            );
                        }
                        else {
                            res.status(401).send(
                                {
                                    status: "error",
                                    reason: "Invalid or expired token"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
            }).catch((e) => {
                console.error(e);
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

app.put('/inventory_item', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const inventory_id = req.header("inventory_id");
        const name = req.header("name");
        const shelf_life = req.header("shelf_life");
        const shelf_life_unit = req.header("shelf_life_unit");
        const reorder_amount = req.header("reorder_amount");
        const reorder_unit = req.header("reorder_unit");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (inventory_id === undefined) {
            return_400(res, "Missing inventory_id in headers");
        }
        else if (name === undefined) {
            return_400(res, "Missing name in headers");
        }
        else if (reorder_amount === undefined) {
            return_400(res, "Missing reorder_amount in headers");
        }
        else if (reorder_unit === undefined) {
            return_400(res, "Missing reorder_unit in headers");
        }
        else if (!inventory_id.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid inventory_id format");
        }
        else if (!name.match(/^[\w\s.,*/]{1,50}$/)) {
            return_400(res, "Invalid name characters or length");
        }
        else if (reorder_amount > 9_999_999_999.99) {
            return_400(res, "reorder_amount too large");
        }
        else if (reorder_amount < 0) {
            return_400(res, "reorder_amount must be positive");
        }
        else if (!reorder_unit.match(/^[\w\s.,*/]{1,20}$/)) {
            return_400(res, "Invalid reorder_unit characters or length");
        }
        else if (shelf_life !== undefined && !Number.isInteger(Number(shelf_life))) {
            return_400(res, "Invalid shelf_life");
        }
        else if (shelf_life_unit !== undefined && !shelf_life_unit.match(/^[\w\s.,*/]{1,10}$/)) {
            return_400(res, "Invalid shelf_life_unit");
        }
        else {
            database.sessionToMinimumRollID(session_id, "manager").then((employee_id) => {
                if (employee_id && (
                    shelf_life === undefined ||
                    shelf_life_unit === undefined ||
                    shelf_life === null ||
                    shelf_life_unit === null)
                ) {
                    database.executeQuery(
                        `UPDATE tblInventory
                         SET Name          = '${name}',
                             ShelfLife     = NULL,
                             ShelfLifeUnit = NULL,
                             ReorderAmount = ${reorder_amount},
                             ReorderUnit   = '${reorder_unit}'
                         WHERE InventoryID = '${inventory_id}'`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(200).send(
                                {
                                    status: "success",
                                    inventory_id: inventory_id
                                }
                            );
                        }
                        else {
                            return_400(res, "Invalid or missing inventory item");
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else if (employee_id) {
                    database.executeQuery(
                        `UPDATE tblInventory
                         SET Name          = '${name}',
                             ShelfLife     = ${shelf_life},
                             ShelfLifeUnit = '${shelf_life_unit}',
                             ReorderAmount = ${reorder_amount},
                             ReorderUnit   = '${reorder_unit}'
                         WHERE InventoryID = '${inventory_id}'`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(200).send(
                                {
                                    status: "success",
                                    inventory_id: inventory_id
                                }
                            );
                        }
                        else {
                            return_400(res, "Invalid or duplicate inventory item");
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else {
                    database.sessionActivityUpdate(session_id).then((result) => {
                        if (result) {
                            res.status(403).send(
                                {
                                    status: "error",
                                    reason: "Insufficient permission to use this resource"
                                }
                            );
                        }
                        else {
                            res.status(401).send(
                                {
                                    status: "error",
                                    reason: "Invalid or expired token"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
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

app.delete('/inventory_item', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const inventory_id = req.header("inventory_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (inventory_id === undefined) {
            return_400(res, "Missing inventory_id in headers");
        }
        else if (!inventory_id.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid inventory_id format");
        }
        else {
            database.sessionToMinimumRollID(session_id, "manager").then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `DELETE
                         FROM tblInventory
                         WHERE InventoryID = '${inventory_id}'`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(200).send(
                                {
                                    status: "success"
                                }
                            );
                        }
                        else {
                            res.status(409).send(
                                {
                                    status: "error",
                                    reason: "Invalid or missing inventory item"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    })
                }
                else {
                    database.sessionActivityUpdate(session_id).then((result) => {
                        if (result) {
                            res.status(403).send(
                                {
                                    status: "error",
                                    reason: "Insufficient permission to use this resource"
                                }
                            );
                        }
                        else {
                            res.status(401).send(
                                {
                                    status: "error",
                                    reason: "Invalid or expired token"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
            }).catch((e) => {
                console.error(e);
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

app.post('/inventory_change', (req, res) => {
    try {
        const hist_id = database.gen_uuid();
        const change_amount = req.header("change_amount");
        const session_id = req.header("session_id");
        const inventory_id = req.header("inventory_id");
        const description = req.header("description");
        // ISO 8601 format date for the database: https://learn.microsoft.com/en-us/sql/t-sql/data-types/datetime-transact-sql?view=sql-server-ver16
        let expiration_date = req.header("expiration_date");

        let test_date = new Date(expiration_date);

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (inventory_id === undefined) {
            return_400(res, "Missing inventory_id in headers");
        }
        else if (change_amount === undefined) {
            return_400(res, "Missing change_amount in headers");
        }
        else if (!inventory_id.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid inventory_id format");
        }
        else if (!isNumber(change_amount)) {
            return_400(res, "change_amount must be a number")
        }
        else if (change_amount > 9_999_999_999.99) {
            return_400(res, "change_amount too large");
        }
        else if (change_amount < -9_999_999_999.99) {
            return_400(res, "change_amount too small");
        }
        else if (expiration_date !== undefined && (test_date.toString() === "Invalid Date" || isNaN(test_date.getTime()) || test_date.toISOString() !== expiration_date)) {
            return_400(res, "Invalid expiration_date format. It should be in ISO 8601 format");
        }
        else if (description !== undefined && !description.match(/^[\w\s.,*/]{1,255}$/)) {
            if (description.length > 255) {
                return_400(res, "Description too long. It should be 255 characters or less");
            }
            else {
                return_400(res, "Invalid description format");
            }
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id && expiration_date !== undefined) {
                    database.executeQuery(
                        `INSERT INTO tblInventoryHistory (HistID, ChangeAmount, EmployeeID, InventoryID, ` +
                         (description !== undefined ? 'Description, ' : '') +
                         'ExpirationDate) ' +
                         `VALUES ('${hist_id}', ${change_amount}, '${employee_id}', '${inventory_id}', ` +
                         (description !== undefined ? `\'${description}\', ` : '') +
                         `CAST ('${expiration_date}' AS DATETIME))`
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(201).send(
                                {
                                    status: "success",
                                    hist_id: hist_id
                                }
                            );
                        }
                        else {
                            return_400(res, "Invalid query value(s)");
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else if (employee_id) {
                    database.executeQuery(
                        `INSERT INTO tblInventoryHistory (HistID, ChangeAmount, EmployeeID, InventoryID` +
                         (description !== undefined ? ', Description' : '') +
                         `) VALUES ('${hist_id}', ${change_amount}, '${employee_id}', '${inventory_id}'` +
                         (description !== undefined ? `, \'${description}\'` : '') +
                         ')'
                    ).then((result) => {
                        if (result.rowsAffected[0] > 0) {
                            res.status(201).send(
                                {
                                    status: "success",
                                    hist_id: hist_id
                                }
                            );
                        }
                        else {
                            return_400(res, "Invalid query value(s)");
                        }
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.error(e);
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

app.get('/inventory_change', (req, res) => {
    try {
        // Pagination, default of one page with 20 items
        const page = isNumber(req.header("page")) ? Number(req.header("page")) : 1;
        const page_size = isNumber(req.header("page_size")) ? Number(req.header("page_size")) : 20;
        const session_id = req.header("session_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (page_size > 30) {
            return_400(res, "Invalid page size. Page size must be <= 30");
        }
        else if (page_size < 1) {
            return_400(res, "Invalid page size. Page size must be > 0");
        }
        else if (page < 1) {
            return_400(res, "Page must be >= 1")
        }
        else if (!Number.isInteger(page_size)) {
            return_400(res, "page_size must be an integer");
        }
        else if (!Number.isInteger(page)) {
            return_400(res, "page must be an integer");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `SELECT inv.InventoryID,
                                inv.Name,
                                inv.ShelfLife,
                                inv.ShelfLifeUnit,
                                inv.ReorderAmount,
                                inv.ReorderUnit,
                                hist.HistID,
                                hist.ChangeAmount,
                                hist.EmployeeID,
                                hist.Description,
                                hist.Date,
                                hist.ExpirationDate
                         FROM tblInventory AS inv
                                  INNER JOIN tblInventoryHistory AS hist ON inv.InventoryID = hist.InventoryID`
                    ).then((result) => {
                        // Make sure that there are results
                        if (result.rowsAffected > 0) {
                            // Paginate and return the results
                            let inventory_list = result.recordsets[0];
                            res.status(200).send(
                                {
                                    status: "success",
                                    page: page,
                                    page_count: Math.ceil(inventory_list.length / page_size),
                                    content: inventory_list.slice(page * page_size - page_size, page * page_size)
                                }
                            );
                            // Otherwise, we know that there are no inventory items in the database
                        }
                        else {
                            res.status(503).send(
                                {
                                    status: "error",
                                    reason: "No inventory items or history in the database. Try creating some inventory and changes with history first"
                                }
                            );
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

app.delete('/inventory_change', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const hist_id = req.header("hist_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (hist_id === undefined) {
            return_400(res, "Missing hist_id in headers");
        }
        else if (!hist_id.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid hist_id format");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `DELETE
                         FROM tblInventoryHistory
                         WHERE HistID = '${hist_id}'`
                    ).then((result) => {
                        if (result.rowsAffected > 0) {
                            res.status(200).send(
                                {
                                    status: "success"
                                }
                            );
                        }
                        else {
                            res.status(404).send(
                                {
                                    status: "error",
                                    reason: `There is no InventoryHistory row matching ${hist_id}`
                                }
                            );
                        }
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.error(e);
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

app.get('/inventory_amount', (req, res) => {
    try {
        // Pagination, default of one page with 20 items
        const page = isNumber(req.header("page")) ? Number(req.header("page")) : 1;
        const page_size = isNumber(req.header("page_size")) ? Number(req.header("page_size")) : 20;
        const session_id = req.header("session_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (page_size > 30) {
            return_400(res, "Invalid page size. Page size must be <= 30");
        }
        else if (page_size < 1) {
            return_400(res, "Invalid page size. Page size must be > 0");
        }
        else if (page < 1) {
            return_400(res, "Page must be >= 1")
        }
        else if (!Number.isInteger(page_size)) {
            return_400(res, "page_size must be an integer");
        }
        else if (!Number.isInteger(page)) {
            return_400(res, "page must be an integer");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `SELECT inv.InventoryID,
                                inv.Name,
                                SUM(COALESCE(hist.ChangeAmount, 0)) AS Amount,
                                inv.ShelfLife,
                                inv.ShelfLifeUnit,
                                inv.ReorderAmount,
                                inv.ReorderUnit
                         FROM tblInventory AS inv
                                  LEFT JOIN tblInventoryHistory as hist ON inv.InventoryID = hist.InventoryID
                         GROUP BY inv.InventoryID, inv.Name, inv.ShelfLife, inv.ShelfLifeUnit, inv.ReorderAmount,
                                  inv.ReorderUnit`
                    ).then((result) => {
                        // Make sure that there are results
                        if (result.rowsAffected > 0) {
                            // Paginate and return the results
                            let inventory_list = result.recordsets[0];
                            res.status(200).send(
                                {
                                    status: "success",
                                    page: page,
                                    page_count: Math.ceil(inventory_list.length / page_size),
                                    content: inventory_list.slice(page * page_size - page_size, page * page_size)
                                }
                            );
                            // Otherwise, we know that there are no inventory items in the database
                        }
                        else {
                            res.status(503).send(
                                {
                                    status: "error",
                                    reason: "No inventory items or history in the database. Try creating some inventory and changes with history first"
                                }
                            );
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

module.exports = app;