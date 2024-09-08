const test = require('unit.js');
const assert = require('assert');
const { v4 } = require('uuid');
const dotenv = require('dotenv');

// Database setup:
process.env.NODE_ENV = "development";
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

describe("Ensure that tokens can be converted to employee ids", function () {
    it("Insert and retrieve session token", async function () {
        const session_id = v4().replace(/-/g, '');
        const employee_id = "T00000000";

        // Add the new session to the sessions table
        await database.executeQuery(
            `INSERT INTO tblUsers (EmployeeID, FirstName, LastName, Username, Password) VALUES ('${employee_id}', 'John', 'Smith', 'j_smith', 'password')`
        )
        .then(() => {})
        .catch((e) => {
            if (e.message.startsWith("Violation of PRIMARY KEY constraint")) {
                console.log("Tables exist already. If this is not intended, you may wish to recreate tables tblUsers and tblSessions.")
            }
            else {
                throw e;
            }
        });
        await database.executeQuery(
            `INSERT INTO tblSessions (SessionID, EmployeeID, CreateDateTime, LastActivityDateTime) VALUES ('${session_id}', '${employee_id}', GETDATE(), GETDATE())`
        ).then(() => {});

        const response = await database.sessionToEmployeeID(session_id);

        test
            .string(response)   // Ensure it's a string
            .is(employee_id);   // And make sure it's the right one
    });

});

describe("Only increment valid sessions", function () {
    it("Should not allow expired sessions to be incremented.", async function () {
        const session_id = v4().replace(/-/g, '');
        const employee_id = "T00000001";

        // Add the new session to the sessions table
        await database.executeQuery(
            `INSERT INTO tblUsers (EmployeeID, FirstName, LastName, Username, Password) VALUES ('${employee_id}', 'John', 'Smith', 'j_smith', 'password')`
        )
        .then(() => {})
        .catch((e) => {
            if (e.message.startsWith("Violation of PRIMARY KEY constraint")) {
                console.log("Tables exist already. If this is not intended, you may wish to recreate tables tblUsers and tblSessions.")
            }
            else {
                throw e;
            }
        });
        // Add an expired session to the table
        await database.executeQuery(
            `INSERT INTO tblSessions (SessionID, EmployeeID, CreateDateTime, LastActivityDateTime) VALUES ('${session_id}', '${employee_id}', GETDATE(), DATEADD(DAY, -${database.MAX_SESSION_DAYS + 1}, GETDATE()))`
        ).then(() => {});

        const response = await database.sessionToEmployeeID(session_id);

        test
            .bool(response)     // Ensure it's a boolean
            .isFalse(response); // that's false, representing an invalid session
    });
    it("Should increment valid sessions", async function () {
        const session_id = v4().replace(/-/g, '');
        const employee_id = "T00000002";

        // Add the new session to the sessions table
        await database.executeQuery(
            `INSERT INTO tblUsers (EmployeeID, FirstName, LastName, Username, Password) VALUES ('${employee_id}', 'Johnny', 'Smith', 'j_smith', 'password')`
        )
            .then(() => {})
            .catch((e) => {
                if (e.message.startsWith("Violation of PRIMARY KEY constraint")) {
                    console.log("Tables exist already. If this is not intended, you may wish to recreate tables tblUsers and tblSessions.")
                }
                else {
                    throw e;
                }
            });
        // Add a valid session to the table
        await database.executeQuery(
            `INSERT INTO tblSessions (SessionID, EmployeeID, CreateDateTime, LastActivityDateTime) VALUES ('${session_id}', '${employee_id}', DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE()))`
        ).then(() => {});

        // Make sure that it was deemed valid
        const response = await database.sessionToEmployeeID(session_id);
        test
            .string(response)   // Ensure it's a string
            .is(employee_id);   // and is the right one

        // Make sure that `LastActivityDateTime` was incremented
        const response_employee_id = await database.executeQuery(
            `SELECT EmployeeID FROM tblSessions WHERE SessionID = '${session_id}' and CreateDateTime < LastActivityDateTime`
        ).then((result) => {
            return result.recordset[0]["EmployeeID"];
        });
        test
            .string(response_employee_id)   // Ensure it's a string
            .is(employee_id);               // and is the right one
    });
});
