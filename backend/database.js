/**
 * From https://learn.microsoft.com/en-us/azure/azure-sql/database/azure-sql-javascript-mssql-quickstart?view=azuresql&tabs=passwordless%2Cservice-connector%2Cportal
 */

const sql = require('mssql');

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
        console.log(`Database: config: ${JSON.stringify(config)}`);
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
            } else {
                console.log('Database already connected');
            }
        } catch (error) {
            console.error(`Error connecting to database: ${JSON.stringify(error)}, ${error.message}`);
        }
    }

    /**
     * Disconnect from the database
     */
    async disconnect() {
        try {
            this.poolconnection.close();
            console.log('Database connection closed');
        } catch (error) {
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
        return await request.query(query);
    }

    /**
     * Update a session token's activity timestamp
     * @param session_id {String} the session string sent to the API; doesn't need to be sanitized.
     * @returns {Promise<boolean>} true on success, false on failure (old/invalid token)
     */
    async sessionActivityUpdate(session_id) {
        // Regex SQL injection validation
        if (!session_id.match(/[0-9A-Za-z]{32}/)) {
            return false;
        }

        // Bump the date
        return await this.executeQuery(
            `UPDATE tblSessions Set LastActivityDateTime = GETDATE() WHERE SessionID = '${session_id}' and LastActivityDateTime >= DATEADD(DAY, -${this.MAX_SESSION_DAYS}, GETDATE())`
        ).then((value) => {
            return value.rowsAffected[0] === 1;
        }).catch((e) => {
            console.log(e);
            return false;
        })
    }

    /**
     * Get an employee ID from a session token.
     * @param session_id {String} the session string sent to the API; doesn't need to be sanitized.
     * @returns {Promise<string|boolean>} employee id string or false if the token is invalid.
     */
    async sessionToEmployeeID(session_id) {
        // Validate token and update last activity
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
            } else {
                return false;
            }
        }).catch((e) => {
            console.log(e);
            return false;
        });
    }
}

module.exports = Database;