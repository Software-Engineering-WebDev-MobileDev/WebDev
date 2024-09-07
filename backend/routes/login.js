const bodyParser = require('body-parser');
const express = require('express');
const crypto = require('crypto');
const { v4 } = require('uuid');
const {return_500, return_400} = require('./codes')

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const {RequestError} = require("mssql/lib/base");
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

const gen_session_id = function () {
    return v4().replace(/-/g, '');
}

app.post('/create_account', (req, res) => {
    let employee_id,    // EmployeeID field in the request header
        first_name,     // FirstName field in the request header
        last_name,      // LastName field in the request header
        username,       // Username field in the request header
        password;       // Password field in the request header

    try {
        // Get header fields
        employee_id = req.header('employee_id');
        first_name = req.header('first_name');
        last_name = req.header('last_name');
        username = req.header('username');
        password = req.header('password');

        // Basic username/password verification
        if (username.length < 4 || password.length < 8) {
            return_400(res, "Invalid username or password length");
        }
        // Prevent SQL injection with the username
        else if (!username.match(/^[A-Za-z0-9]+$/) || username.length > 20) {
            return_400(res, "Invalid username contents");
        }
        // Prevent SQL injection with the first_name
        else if (!first_name.match(/^[A-Za-z\-]+$/) || first_name.length > 64) {
            return_400(res, "Invalid first_name contents");
        }
        // Prevent SQL injection with the last_name
        else if (!last_name.match(/^[A-Za-z\-]+$/) || last_name.length > 64) {
            return_400(res, "Invalid last_name contents");
        }
        else if (!employee_id.match(/^[A-Za-z0-9]+$/) || employee_id.length > 50) {
            return_400(res, "Invalid employee_id contents");
        }
        // Undefined check
        else if (!employee_id || !first_name || !last_name || !username || !password) {
            return_400(res, "Missing employee_id, first_name, last_name, username, or password");
        }
        else {
            // Since we're hashing the password, we don't need to check it for SQL injection.
            const password_hash =
                crypto.createHash('sha512')
                    .update(username)           // Use the username as the salt
                    .update(password)           // Hash the password itself
                    .digest('hex');    // Grab the hex digest for the DB

            // Insert the user into the DB
            database.executeQuery(
                `INSERT INTO tblUsers (EmployeeID, FirstName, LastName, Username, Password) VALUES ('${employee_id}', '${first_name}', '${last_name}', '${username}', '${password_hash}')`
            ).then(() => {
                // Generate a session ID
                const session_id = gen_session_id()

                // Add the new session to the sessions table
                database.executeQuery(
                    `INSERT INTO tblSessions (SessionID, EmployeeID, CreateDateTime, LastActivityDateTime) VALUES ('${session_id}', '${employee_id}', GETDATE(), GETDATE())`
                ).then(() => {
                    // Return the new session ID
                    res.status(201).send(
                        {
                            status: "success",
                            session_id: session_id
                        }
                    );
                }).catch((e) => {
                    if (e instanceof RequestError && e.message.startsWith("Violation of PRIMARY KEY constraint")) {
                        return_400(res, "User exists");
                    }
                    else {
                        return_500(res);
                    }
                });
            }).catch((e) => {
                if (e instanceof RequestError && e.message.startsWith("Violation of PRIMARY KEY constraint")) {
                    return_400(res, "User exists");
                }
                else if (e instanceof RequestError) {
                    console.log(e);
                    console.log("If this is thrown in the dev environment, you likely wrote a bad SQL query.");
                    return_500(res);
                }
                else {
                    console.log(e);
                    return_500(res);
                }
            })
        }
    }
    catch (e) {
        // TypeError is thrown if any field is undefined
        if (e instanceof TypeError) {
            return_400(res, "Missing employee_id, first_name, last_name, username, or password")
        }
        // Something else went wrong
        else {
            return_500(res);
        }
    }
});

app.post('/login', (req, res) => {
    let username,   // Username field in the request header
        password;   // Password field in the request header
    try {
        username = req.header('username');
        password = req.header('password');

        if (username.length < 4 || password.length < 8) {
            res.status(400).send(
                {
                    status: "error",
                    reason: "Invalid username or password length"
                }
            );
        }
        // Prevent SQL injection with the username
        else if (!username.match(/^[A-Za-z0-9]+$/) || username.length > 20) {
            return_400(res, "Invalid username contents");
        }
        else {
            // Since we're hashing the password, we don't need to check it for SQL injection.
            const password_hash =
                crypto.createHash('sha512')
                    .update(username)           // Use the username as the salt
                    .update(password)           // Hash the password itself
                    .digest('hex');    // Grab the hex digest for the DB

            database.executeQuery(
                `SELECT EmployeeID FROM tblUsers WHERE Username = '${username}' and Password = '${password_hash}';`
            ).then((result) => {
                if (result.rowsAffected[0] === 1) {
                    const employee_id = result.recordset[0]["EmployeeID"];
                    const session_id = gen_session_id()

                    // Add the new session to the sessions table
                    database.executeQuery(
                        `INSERT INTO tblSessions (SessionID, EmployeeID, CreateDateTime, LastActivityDateTime) VALUES ('${session_id}', '${employee_id}', GETDATE(), GETDATE())`
                    ).then(() => {
                        // Return the new session ID
                        res.status(201).send(
                            {
                                status: "success",
                                session_id: session_id
                            }
                        );
                    }).catch(() => {
                        return_500(res);
                    });
                }
                else {
                    throw new Error("Invalid username or password");
                }
            }).catch((e) => {
                if (e.message === "Invalid username or password") {
                    res.status(401).send({
                        status: "error",
                        reason: e.message
                    });
                }
                else {
                    return_500(res);
                }
            });
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            res.status(400).send(
                {
                    status: "error",
                    reason: "Missing username or password"
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

app.post('/logout', (req, res) => {
    let session_id;  // Token field in the request header

    try {
        session_id = req.header('session_id')

        if (!session_id.match(/[0-9A-Za-z]{32}/)) {
            return_400(res, "session_id is not valid");
        }
        else {
            database.executeQuery(
                `DELETE FROM tblSessions WHERE SessionID = '${session_id}'`
            ).then(() => {
                res.status(200).send(
                    {
                        status: "success"
                    }
                )
            }).catch((e) => {
                console.log(e);
                return_500(res);
            })
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            res.status(401).send(
                {
                    status: "error",
                    reason: "Missing token."
                }
            );
        }
        else {
            return_500(res);
        }
    }
});

module.exports = app;