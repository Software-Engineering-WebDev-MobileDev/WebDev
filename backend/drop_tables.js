const config = require("./config");
const Database = require('./database');
const database = new Database(config);

database.executeQuery(
    "EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT all'; EXEC sp_MSforeachtable @command1 = \"DROP TABLE ?\""
).then(() => {
    console.log("Tables dropped");
}).catch((e) => {
    console.log(`Error dropping tables ${e}`)
})
