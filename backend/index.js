// Modules
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');

// Database setup/config
const config = require('./config.js');
const Database = require('./database');
const fs = require('node:fs');

// Routes
const loginRouter = require('./routes/login')
const productRequirementRouter = require('./routes/product_requirements')
const inventoryRouter = require('./routes/inventory')

// App
const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());  // For security policy
app.use(cors());    // For Cross-Origin Resource Sharing
app.use(compression());     // For bandwidth saving on the more intensive actions


// Development only
// Run this to create the tables in the database
if (process.env.NODE_ENV.trim() === 'development') {
    const database = new Database(config);
    fs.readFile('./schema.sql', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        else {
            database
                .executeQuery(data)
                .then(() => {
                    // Insert some email types
                    database.executeQuery(
                        "INSERT INTO tblEmailTypes (TypeID, Description, Active) VALUES " +
                        "('personal', 'Personal Email', 1), " +
                        "('work', 'Work Email', 1), " +
                        "('other', 'Other Email', 1)"
                    ).then(() => {});
                    // Insert some phone types
                    database.executeQuery(
                        "INSERT INTO tblPhoneTypes (TypeID, Description, Active) VALUES " +
                        "('mobile', 'Mobile Phone', 1), " +
                        "('home', 'Home Phone', 1), " +
                        "('work', 'Work Phone', 1), " +
                        "('fax', 'Fax', 1)"
                    ).then(() => {});

                    console.log('Tables created');
                })
                .catch((err) => {
                    // Table may already exist
                    if (err.message.match(/There is already an object named '\w+' in the database./)) {
                        console.log("Tables exist already. If this is not intended, you may wish to drop all tables.")
                    }
                    else {
                        console.error(`Error creating table: ${err}`);
                    }
                });
        }
    });
}

// Express setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes usage
app.use('/api',
    loginRouter,
    productRequirementRouter,
    inventoryRouter
);

// Serve the static frontend
app.use('/', express.static('../BakerySite'));

// Docker healthcheck
app.get('/health', (req, res) => {
    res.status(200).send("Healthy: OK");
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;