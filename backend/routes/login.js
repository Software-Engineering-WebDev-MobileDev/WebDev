const bodyParser = require('body-parser');
const express = require('express');
const crypto = require('crypto');

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.post('/create_account', (req, res) => {
    let username, // Username field in the request header
        password, // Password field in the request header
        role;     // Role field in the request header

    // Admin accounts shouldn't *just* be able to be created
    const roles = ['employee', 'user'];
    try {
        username = req.header('username');
        password = req.header('password');
        role = req.header('role');

        // Basic username/password verification
        if (username.length < 4 || password.length < 8) {
            res.status(400).send(
                {
                    status: "error",
                    reason: "Invalid username or password length"
                }
            );
        }
        // Prevent SQL injection with the username
        else if (!username.match(/^[A-Za-z0-9]+$/)) {
            res.status(400).send({
                status: "error",
                reason: "Invalid username contents"
            });
        }
        // Ensure that role is valid
        else if (!roles.includes(role)) {
            res.status(400).send({
                status: "error",
                reason: "Invalid role"
            });
        } else {
            // Since we're hashing the password, we don't need to check it for SQL injection.
            const password_hash =
                crypto.createHash('sha512')
                    .update(username)           // Use the username as the salt
                    .update(password)           // Hash the password itself
                    .digest('hex');    // Grab the hex digest for the DB

            // Insert the user into the DB
            database.executeQuery(
                `INSERT INTO Users (username, password, role) VALUES ('${username}', '${password_hash}', '${role}')`
            ).then((result) => {
                console.log(result);
                // TODO: Create and return some sort of Auth token here
                res.status(200).send(
                    {
                        status: "success",
                        token: "example_JWT"
                    }
                );
            }).catch((e) => {
                console.log(e);
                res.status(500).send(
                    {
                        status: "error",
                        reason: "The server is having a bad day. Please send encouraging words."
                    }
                );
            })
        }
    }
    catch (e) {
        // TypeError is thrown if any field is undefined
        if (e instanceof TypeError) {
            res.status(400).send(
                {
                    status: "error",
                    reason: "Missing username or password, or invalid role."
                }
            );
        }
        // Something else went wrong
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

app.post('/login', (req, res) => {
    let username, password;
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
        // TODO: Actually do something here
        else {
            res.status(200).send(
                {
                    status: "success",
                    token: "example_JWT"
                }
            );
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
    let token;

    try {
        token = req.header('token')

        // TODO: Logout by invalidating the token?
        res.status(200).send({"status": "success"});
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