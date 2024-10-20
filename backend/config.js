const dotenv = require('dotenv');
dotenv.config({path: `.env.${process.env.NODE_ENV}`.trim(), debug: true, encoding: 'UTF-8'});

const server = process.env.AZURE_SQL_SERVER.trim();
const database = process.env.AZURE_SQL_DATABASE;
const port = parseInt(process.env.AZURE_SQL_PORT);
const type = process.env.AZURE_SQL_AUTHENTICATIONTYPE;
const user = process.env.AZURE_SQL_USER;
const password = process.env.AZURE_SQL_PASSWORD;

let config;

if (type) {
    config = {
        server,
        port,
        database,
        authentication: {
            type
        },
        options: {
            encrypt: true
        }
    };
}
else if (process.env.NODE_ENV.includes("development")) {
    config = {
        server,
        port,
        database,
        user,
        password,
        options: {
            encrypt: false
        }
    };
}
else {
    config = {
        server,
        port,
        database,
        user,
        password,
        options: {
            encrypt: true
        }
    };
}

module.exports = config;