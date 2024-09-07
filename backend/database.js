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
            console.error(`Error connecting to database: ${JSON.stringify(error)}`);
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
}

module.exports = Database;