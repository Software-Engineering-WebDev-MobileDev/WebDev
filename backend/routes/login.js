const bodyParser = require('body-parser');
const express = require('express');
const crypto = require('crypto');
const {return_500, return_400, return_498} = require('./codes')
const {email_types, phone_types, validate_email} = require('./validate');

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const {RequestError} = require("mssql/lib/base");
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());


app.post('/create_account', async (req, res) => {
    try {
        // Get header fields
        const employee_id = req.header('employee_id');  // EmployeeID field in the request header
        const first_name = req.header('first_name');    // FirstName field in the request header
        const last_name = req.header('last_name');      // LastName field in the request header
        const username = req.header('username');        // Username field in the request header
        const password = req.header('password');        // Password field in the request header
        let email_address = req.header('email_address');
        let phone_number = req.header('phone_number');

        if (employee_id === undefined) {
            return_400(res, "Missing employee_id");
        }
        else if (first_name === undefined) {
            return_400(res, "Missing first_name");
        }
        else if (last_name === undefined) {
            return_400(res, "Missing last_name");
        }
        else if (username === undefined) {
            return_400(res, "Missing username");
        }
        else if (password === undefined) {
            return_400(res, "Missing password");
        }
        // Basic username/password verification
        else if (username.length < 4 || password.length < 8) {
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
        else if (!employee_id.match(/^[A-Za-z0-9]{1,50}$/) || employee_id.length > 50) {
            return_400(res, "Invalid employee_id contents");
        }
        // Undefined check
        else if (!employee_id || !first_name || !last_name || !username || !password) {
            return_400(res, "Missing employee_id, first_name, last_name, username, or password");
        }
        // Validate optional email and phone number parameters
        else if (email_address !== undefined && validate_email(email_address)) {
            return_400(res, "Invalid email");
        }
        else if (phone_number !== undefined && !phone_number.match(/^\(?\d{3}\)?[\d -]?\d{3}[\d -]?\d{4}$/)) {
            return_400(res, "Invalid phone number");
        }
        else {
            // Since we're hashing the password, we don't need to check it for SQL injection.
            const password_hash =
                crypto.createHash('sha512')
                    .update(username)           // Use the username as the salt
                    .update(password)           // Hash the password itself
                    .digest('hex');    // Grab the hex digest for the DB

            // Make the first user the owner, otherwise default to employee
            let role = "3";
            let role_query = database.executeQuery(
                `SELECT * FROM tblUsers`
            ).then((result) => {
                if (result.rowsAffected[0] === 0) {
                    role = "0";
                }
            }).catch((e) => {
                console.error(e);
            })

            let can_use_phone = true;
            let can_use_email = true;

            // Check for the given phone number in the database
            let phone_query = database.executeQuery(
                `SELECT * FROM tblPhoneNumbers WHERE PhoneNumber = '${phone_number}'`
            ).then((result) => {
                if (result.rowsAffected[0] !== 0) {
                    can_use_phone = false;
                }
            }).catch((e) => {
                console.error(e);
                // can_use_phone = false;
            });
            // Check for the given email in the database
            let email_query = database.executeQuery(
                `SELECT * FROM tblEmail WHERE EmailAddress = '${email_address}'`
            ).then((result) => {
                if (result.rowsAffected[0] !== 0) {
                    can_use_email = false;
                }
            }).catch((e) => {
                console.error(e);
                // can_use_email = false;
            });

            await role_query;
            await phone_query;
            await email_query;

            if (!can_use_email) {
                return_400(res, "Duplicate emails cannot be used for primary type!");
            }
            else if (!can_use_phone) {
                return_400(res, "Duplicate phone numbers cannot be used for primary type!");
            }
            else {
                // Insert the user into the DB
                database.executeQuery(
                    `INSERT INTO tblUsers (EmployeeID, FirstName, LastName, Username, Password, RoleID, StartDate)
                     VALUES ('${employee_id}', '${first_name}', '${last_name}', '${username}', '${password_hash}',
                             '${role}', GETDATE())`
                ).then(async () => {
                    if (email_address) {
                        database.executeQuery(
                            `INSERT INTO tblEmail
                             VALUES ('${database.gen_uuid()}', '${email_address}', '${employee_id}', 'primary', 1)`
                        ).then(() => {
                            }
                        ).catch((e) => {
                            console.error(e);
                        });
                    }
                    if (phone_number) {
                        const digits = phone_number.replace(/\D/g, '');
                        database.executeQuery(
                            `INSERT INTO tblPhoneNumbers
                             VALUES ('${database.gen_uuid()}', '${digits}', 'primary', 1, '${employee_id}')`
                        ).then(() => {
                            }
                        ).catch((e) => {
                            console.error(e);
                        });
                    }
                    // Generate a session ID
                    const session_id = database.gen_uuid()

                    // Add the new session to tblSessions
                    database.executeQuery(
                        `INSERT INTO tblSessions (SessionID, EmployeeID, CreateDateTime, LastActivityDateTime)
                         VALUES ('${session_id}', '${employee_id}', GETDATE(), GETDATE())`
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
                            console.error(e);
                            return_500(res);
                        }
                    });
                }).catch((e) => {
                    if (e instanceof RequestError && e.message.startsWith("Violation of PRIMARY KEY constraint")) {
                        return_400(res, "User exists");
                    }
                    else if (e instanceof RequestError) {
                        console.error(e);
                        console.error("If this is thrown in the dev environment, you likely wrote a bad SQL query.");
                        return_500(res);
                    }
                    else {
                        console.error(e);
                        return_500(res);
                    }
                });
            }
        }
    }
    catch (e) {
        // TypeError is thrown if any field is undefined
        if (e instanceof TypeError) {
            return_400(res, "Missing employee_id, first_name, last_name, username, or password")
        }
        // Something else went wrong
        else {
            console.error(e);
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
                `SELECT EmployeeID
                 FROM tblUsers
                 WHERE Username = '${username}'
                   AND Password = '${password_hash}';`
            ).then((result) => {
                if (result.rowsAffected[0] === 1) {
                    const employee_id = result.recordset[0]["EmployeeID"];
                    const session_id = database.gen_uuid();

                    // Add the new session to the sessions table
                    database.executeQuery(
                        `INSERT INTO tblSessions (SessionID, EmployeeID, CreateDateTime, LastActivityDateTime)
                         VALUES ('${session_id}', '${employee_id}', GETDATE(), GETDATE())`
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
                    res.status(401).send(
                        {
                            status: "error",
                            reason: e.message
                        });
                }
                else {
                    console.error(e);
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
            console.error(e);
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
        session_id = req.header('session_id');

        if (!session_id.match(/^[0-9A-Za-z]{32}$/)) {
            return_400(res, "session_id is not valid");
        }
        else {
            database.executeQuery(
                `DELETE
                 FROM tblSessions
                 WHERE SessionID = '${session_id}'`
            ).then(() => {
                res.status(200).send(
                    {
                        status: "success"
                    }
                );
            }).catch((e) => {
                console.error(e);
                return_500(res);
            })
        }
    }
    catch (e) {
        console.error(e);
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

app.post("/token_bump", (req, res) => {
    try {
        const session_id = req.header('session_id');

        // Bump the session (if valid)
        database.sessionActivityUpdate(session_id).then((result) => {
            // Valid and bumped token
            if (result) {
                res.status(200).send(
                    {
                        status: "success"
                    });
            }
            // Invalid or expired token
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.error(e);
            return_500(res);
        });
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

module.exports = app;