// This should **only** be run in the development environment!
const dotenv = require('dotenv');
process.env.NODE_ENV = "development";

const config = require("./config");
const Database = require('./database');
const database = new Database(config);

let table_drops = [
    "DROP TABLE tblUserRoles",
    "DROP TABLE tblUsers",
    "DROP TABLE tblEmailTypes",
    "DROP TABLE tblEmail",
    "DROP TABLE tblPhoneTypes",
    "DROP TABLE tblPhoneNumbe",
    "DROP TABLE tblSessions",
    "DROP TABLE tblInventory",
    "DROP TABLE tblInventoryHistory",
    "DROP TABLE tblPurchaseOrder",
    "DROP TABLE tblRecipes",
    "DROP TABLE tblIngredients",
    "DROP TABLE tblIngredientModifiers",
    "DROP TABLE tblRecipeIngredientModifier",
    "DROP TABLE tblTasks",
    "DROP TABLE tblTaskComments",
    "DROP TABLE tblTaskAssignmentHistory",
    "DROP TABLE tblTaskStatusAudit"
];
table_drops = table_drops.reverse();

database.executeQuery(
    "EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT all'; EXEC sp_MSforeachtable @command1 = \"DROP TABLE ?\""
).then(() => {
    console.log("Tables dropped");
}).catch((e) => {
    console.log(`Error dropping tables ${e}\nTrying again...`);
    table_drops.forEach(async (drop_query) => {
        await database.executeQuery(
            drop_query
        ).then(() => {
            console.log(`Dropped ${drop_query.substring(drop_query.lastIndexOf(' ') + 1)}`)
        }).catch((e2) => {
            if (e2.number === 3701) {
                console.log(`${drop_query.substring(drop_query.lastIndexOf(' ') + 1)} already dropped`)
            }
            else {
                throw e2;
            }
        });
    });
    console.log("\033[92mSuccessfully dropped all tables\033[0m")
});
