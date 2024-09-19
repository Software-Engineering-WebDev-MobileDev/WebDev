/**
 * From https://learn.microsoft.com/en-us/azure/azure-sql/database/azure-sql-javascript-mssql-quickstart?view=azuresql&tabs=passwordless%2Cservice-connector%2Cportal
 */

const sql = require('mssql');
const {v4} = require('uuid');

/**
 * A class for interfacing with Microsoft SQL databases
 */
class Database {
    config = {};
    poolconnection = null;
    connected = false;
    MAX_SESSION_DAYS = 7;

    /**
     * Create a new instance of a database connection based on the provided configuration.
     * @param config The configuration object to use, defining the connection parameters.
     */
    constructor(config) {
        this.config = config;
        if (process.env.NODE_ENV.trim() === 'development') {
            console.log(`Database: config: ${JSON.stringify(config)}`);
        }
    };

    /**
     * Establish the connection to the database.
     */
    async connect() {
        try {
            console.log(`Database connecting...${this.connected}`);
            if (this.connected === false) {
                this.poolconnection = await sql.connect(this.config);
                this.connected = true;
                console.log('Database connection successful');
            }
            else {
                if (process.env.NODE_ENV.trim() === 'development') {
                    console.log('Database already connected');
                }
            }
        }
        catch (error) {
            console.error(`Error connecting to database: ${JSON.stringify(error)}, ${error.message}`);
        }
    }

    /**
     * Disconnect from the database
     */
    async disconnect() {
        try {
            this.poolconnection.close();
            this.connected = false;
            if (process.env.NODE_ENV.trim() === 'development') {
                console.log('Database connection closed');
            }
        }
        catch (error) {
            console.error(`Error closing database connection: ${error}`);
        }
    }

    /**
     * Execute a query against the database.
     * @param query {String} The query to execute. MUST BE SANITIZED!
     */
    async executeQuery(query) {
        await this.connect();
        const request = this.poolconnection.request();
        const result = await request.query(query);
        await this.disconnect();
        return result;
    }

    /**
     * Update a session token's activity timestamp
     * @param session_id {String} the session string sent to the API; doesn't need to be sanitized.
     * @returns {Promise<boolean>} true on success, false on failure (old/invalid token)
     */
    async sessionActivityUpdate(session_id) {
        // Regex SQL injection validation
        if (!session_id.match(/^\w{0,32}$/)) {
            return false;
        }

        // Bump the date
        return await this.executeQuery(
            `UPDATE tblSessions Set LastActivityDateTime = GETDATE() WHERE SessionID = '${session_id}' and LastActivityDateTime >= DATEADD(DAY, -${this.MAX_SESSION_DAYS}, GETDATE())`
        ).then((value) => {
            return value.rowsAffected[0] === 1;
        }).catch((e) => {
            console.error(e);
            return false;
        })
    }

    /**
     * Get an employee ID from a session token.
     * @param session_id {String} the session string sent to the API; doesn't need to be sanitized.
     * @returns {Promise<string|boolean>} employee id string or false if the token is invalid.
     */
    async sessionToEmployeeID(session_id) {
        // Validate the token and update the last activity date
        if (!(await this.sessionActivityUpdate(session_id))) {
            // Invalid/expired token
            return false;
        }

        // Get the employee id (if valid)
        return await this.executeQuery(
            `SELECT EmployeeID FROM tblSessions WHERE SessionID = '${session_id}'`
        ).then((value) => {
            if (value.rowsAffected[0] === 1) {
                return value.recordset[0]["EmployeeID"];
            }
            else {
                return false;
            }
        }).catch((e) => {
            console.error(e);
            return false;
        });
    }

    /**
     * Get an admin/manager/employee ID from a session token.
     * @param session_id {String} the session string sent to the API; doesn't need to be sanitized.
     * @param role {String} the role the user **must** have
     * @returns {Promise<string|boolean>} employee id string or false if the token/role is invalid.
     */
    async sessionToRollID(session_id, role) {
        // Validate the token and update the last activity date
        if (!(await this.sessionActivityUpdate(session_id))) {
            // Invalid/expired token
            return false;
        }

        switch (role) {
            case "owner":
                role = "0";
                break;
            case "admin":
                role = "1";
                break;
            case "manager":
                role = "2";
                break;
            case "employee":
                role = "3";
                break;
            default:
                break;
        }

        // Get the employee id (if valid)
        return await this.executeQuery(
            `SELECT EmployeeID FROM tblSessions WHERE SessionID = '${session_id}' AND EmployeeID IN (SELECT EmployeeID FROM tblUsers WHERE RoleID = '${role}')`
        ).then((value) => {
            if (value.rowsAffected[0] === 1) {
                return value.recordset[0]["EmployeeID"];
            }
            else {
                return false;
            }
        }).catch((e) => {
            console.log(e);
            return false;
        });
    }

    /**
     * Get an admin/manager/employee ID from a session token with minimum permissions
     * @param session_id {String} the session string sent to the API; doesn't need to be sanitized.
     * @param role {String} the *minimum* role the user **must** have
     * @returns {Promise<string|boolean>} employee id string or false if the token/role is invalid.
     */
    async sessionToMinimumRollID(session_id, role) {
        // Validate the token and update the last activity date
        if (!(await this.sessionActivityUpdate(session_id))) {
            // Invalid/expired token
            return false;
        }

        switch (role) {
            case "owner":
                role = "0";
                break;
            case "admin":
                role = "1";
                break;
            case "manager":
                role = "2";
                break;
            case "employee":
                role = "3";
                break;
            default:
                break;
        }

        // Get the employee id (if valid)
        return await this.executeQuery(
            `SELECT EmployeeID FROM tblSessions WHERE SessionID = '${session_id}' AND EmployeeID IN (SELECT EmployeeID FROM tblUsers WHERE CAST(RoleID AS INT) <= ${role})`
        ).then((value) => {
            if (value.rowsAffected[0] === 1) {
                return value.recordset[0]["EmployeeID"];
            }
            else {
                return false;
            }
        }).catch((e) => {
            console.log(e);
            return false;
        });
    }

    /**
     * Generates a UUID
     * @returns {string} Generated UUID for use in the database.
     */
    gen_uuid() {
        return v4().replace(/-/g, '');
    }
}

module.exports = Database;