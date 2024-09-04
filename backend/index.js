// Modules
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const config = require('./config.js');
const Database = require('./database');

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
    database
        .executeQuery(
            `CREATE TABLE Users (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50)
                );`
        )
        .then(() => {
            console.log('Table created');
        })
        .catch((err) => {
            // Table may already exist
            console.error(`Error creating table: ${err}`);
        });
    database
        .executeQuery(
            `CREATE TABLE Ingredients (
                    ingredient_id INT PRIMARY KEY IDENTITY(1,1),
                    name VARCHAR(255) NOT NULL,
                    unit VARCHAR(50) NOT NULL,
                    calories_per_unit DECIMAL(10, 2) NOT NULL
                );`
        )
        .then(() => {
            console.log('Table created');
        })
        .catch((err) => {
            // Table may already exist
            console.error(`Error creating table: ${err}`);
        });
    database
        .executeQuery(
            `CREATE TABLE Inventory (
                    inventory_id INT PRIMARY KEY IDENTITY(1,1),
                    ingredient_id INT NOT NULL,
                    quantity DECIMAL(10, 2) NOT NULL,
                    last_updated DATETIME NOT NULL,
                    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
                );`
        )
        .then(() => {
            console.log('Table created');
        })
        .catch((err) => {
            // Table may already exist
            console.error(`Error creating table: ${err}`);
        });
    database
        .executeQuery(
            `CREATE TABLE Recipes (
                    recipe_id INT PRIMARY KEY IDENTITY(1,1),
                    recipe_name VARCHAR(255) NOT NULL,
                    instructions TEXT NOT NULL,
                    prep_time INT NOT NULL,
                    baking_time INT NOT NULL
                );`
        )
        .then(() => {
            console.log('Table created');
        })
        .catch((err) => {
            // Table may already exist
            console.error(`Error creating table: ${err}`);
        });
    database
        .executeQuery(
            `CREATE TABLE Recipe_ingredients (
                    recipe_ingredient_id INT PRIMARY KEY IDENTITY(1,1),
                    recipe_id INT NOT NULL,
                    ingredient_id INT NOT NULL,
                    quantity_required DECIMAL(10, 2) NOT NULL,
                    unit VARCHAR(50) NOT NULL,
                    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
                    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
                );`
        )
        .then(() => {
            console.log('Table created');
        })
        .catch((err) => {
            // Table may already exist
            console.error(`Error creating table: ${err}`);
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