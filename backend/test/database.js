const test = require('unit.js');
const assert = require('assert');
const { v4 } = require('uuid');
const dotenv = require('dotenv');
process.env.NODE_ENV = "development";

// Database setup:
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
