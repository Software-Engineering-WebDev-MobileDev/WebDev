/*
 * Definition of some functions for making HTTP codes easier to handle
 */
const express = require('express');

/**
 * Send an HTTP code 400 response.
 * @param res {express.Response} The response object to send error with.
 * @param reason_for {String} A string representing the reason for the 400 response.
 */
const return_400 = function (res, reason_for = "Bad Request") {
    res.status(400).send(
        {
            status: "error",
            reason: reason_for
        }
    );
};

/**
 * Send an HTTP code 498 response.
 * @param res {express.Response} The response object to send error with.
 * @param reason_for {String} A string representing the reason for the 498 response.
 */
const return_498 = function (res, reason_for = "Invalid or expired token") {
    res.status(498).send(
        {
            status: "error",
            reason: reason_for
        }
    );
}

/**
 * Send an HTTP code 500 response.
 * @param res {express.Response} The response object to send error with.
 */
const return_500 = function (res) {
    res.status(500).send(
        {
            status: "error",
            reason: "The server is having a bad day. Please send encouraging words."
        }
    );
};

module.exports = {return_500, return_400, return_498};