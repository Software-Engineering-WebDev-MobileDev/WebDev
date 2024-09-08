// This should **only** be run in the development environment!
const dotenv = require('dotenv');
process.env.NODE_ENV = "development";

const config = require("./config");
const Database = require('./database');
const database = new Database(config);

database.executeQuery(
    "EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT all'; EXEC sp_MSforeachtable @command1 = \"DROP TABLE ?\""
).then(() => {
    console.log("Tables dropped");
}).catch((e) => {
    console.log(`Error dropping tables ${e}\nTrying again...`);
    database.executeQuery(
        "DROP TABLE tblSessions;\n" +
        "DROP TABLE tblEmail;\n" +
        "DROP TABLE tblPhoneNumbers;\n" +
        "DROP TABLE tblRecipeIngredients;\n" +
        "DROP TABLE tblInventory;\n" +
        "DROP TABLE tblTasks;" +
        "DROP TABLE tblRecipeComponents;\n" +
        "DROP TABLE tblRecipes;\n" +
        "DROP TABLE tblUsers;\n" +
        "DROP TABLE tblEmailTypes;\n" +
        "DROP TABLE tblPhoneTypes;\n" +
        "DROP TABLE tblIngredients;"
    ).then(() => {
        console.log("Database tables successfully dropped.");
    }).catch((e2) => {
        console.log("Dropping tables failed. The backend server should not be running and the DB server should be.");
    })
});
