//$env:NODE_ENV="development"; node index.js
//docker compose up -d database
//docker compose stop
//docker compose pull
//docker run -p 3000:3000 docker-image
//docker buildx build -t docker-image .

const bodyParser = require('body-parser');
const express = require('express');
const {return_500, return_400} = require('./codes')
//this is for using uuids in the request
const {v4} = require('uuid');

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const { uuid } = require('uuidv4');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// API routes (not worrying about session yet)

//get a recipe by ID (also returns the associated ingredients)
app.get("/recipe/:recipeID", async (req, res) => {
    if (!req.params.recipeID) {
        return_400(res, "Bad request");
        return;
    }
    const recipeID = req.params.recipeID;
    // const query = `SELECT * FROM tblRecipes WHERE RecipeID = '${recipeID}'`;
    const query = `
    SELECT r.*, 
           ri.RecipeIngredientID, ri.IngredientDescription, ri.Quantity, 
           ri.UnitOfMeasure, ri.QuantityInStock, ri.ReorderFlag, 
           ri.ModifierID, ri.ScalingFactorID
    FROM tblRecipes r
    LEFT JOIN tblRecipeIngredients ri ON r.RecipeID = ri.RecipeID
    WHERE r.RecipeID = '${recipeID}';
  `;
    
    const sessionid = req.headers['session_id'];
    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "success",
            recipe: result.recordset
        });
        //log results
        console.log(result);
    }).catch((e) => {
        console.log(e);
        return_500(res);
    });
});

//add a recipe
app.post('/add_recipe', async (req, res) => {
    const recipeID = v4();

    const now = new Date();
    // Format the date into SQL-friendly format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
    //validate the request
    if (!req.body.RecipeName || !req.body.Instructions || !req.body.Servings) {
        return_400(res, "Bad request");
        return;
    }
    const query = `INSERT INTO tblRecipes (RecipeID, RecipeName, Instructions, Servings, CreatedAt) VALUES ('${recipeID}', '${req.body.RecipeName}', '${req.body.Instructions}', '${req.body.Servings}', '${formattedDate}')`;
    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "success",
            recipeID: recipeID
            // users: result.recordset
        });
        //log results
        console.log(result);
    }).catch((e) => {
        console.log(e);
        return_500(res);
        console.log("formatted date: " + formattedDate);
    });
});

//add a recipe ingredient (recipe must already exist)
app.post('/add_recipe_ingredient', async (req, res) => {
    const recipeIngredientID = v4();
    //validate the request
    if (!req.body.RecipeID || !req.body.IngredientDescription || !req.body.Quantity || !req.body.UnitOfMeasure || !req.body.QuantityInStock || !req.body.ReorderFlag) {
        return_400(res, "Bad request");
        return;
    }
    const query = `INSERT INTO tblRecipeIngredients (RecipeIngredientID, RecipeID, IngredientDescription, Quantity, UnitOfMeasure, QuantityInStock, ReorderFlag) VALUES ('${recipeIngredientID}', '${req.body.RecipeID}', '${req.body.IngredientDescription}', '${req.body.Quantity}', '${req.body.UnitOfMeasure}', '${req.body.QuantityInStock}', '${req.body.ReorderFlag}')`;
    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "success",
            recipeIngredientID: recipeIngredientID
            // users: result.recordset
        });
        //log results
        console.log(result);
    }).catch((e) => {
        console.log(e);
        return_500(res);
    });
});

//returns all recipes
app.get("/recipes", async (req, res) => {
    const query = `SELECT * FROM tblRecipes`;
    const sessionid = req.headers['session_id'];

    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "success",
            recipes: result.recordset
        });
        //log results
        console.log(result);
    }).catch((e) => {
        console.log(e);
        return_500(res);
    });

    // database.sessionToEmployeeID(sessionid).then((employeeID) => {
    //     if (employeeID){
    //         database.executeQuery(query).then((result) => {
    //             res.status(200).send({
    //                 status: "success",
    //                 users: result.recordset
    //             });
    //             //log results
    //             console.log(result);
    //         }).catch((e) => {
    //             console.log(e);
    //             return_500(res);
    //         });
    //     }
    //     else{
    //         return_498(res);
    //     }
    // }).catch((e) => {
    //     console.log(e);
    //     return_500(res);
    // });
});

//everything below this line was for testing purposes------------
app.get("/test_ij", (req, res) => {
    try {
        const page = req.query['page'];

        res.status(200).send({
            status: "success",
            page: 1,
            items: [
                {
                    name: "ij white",
                    age: 99,
                }
            ]
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Bad request");
        }
        else {
            return_500(res);
        }
    }
});

module.exports = app;