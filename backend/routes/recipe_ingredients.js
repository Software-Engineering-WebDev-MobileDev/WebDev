
const bodyParser = require('body-parser');
const express = require('express');
const {return_500, return_400, return_498} = require('./codes')
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

// return the ingredients for a recipe
app.get("/recipe_full/:recipeID", async (req, res) => {
    try {
        const session_id = req.header("session_id");
        if (req.params.recipeID === undefined) {
            return_400(res, "Bad request");
            return;
        }
        const recipeID = req.params.recipeID;
        const query = `-- Full Recipe Query: Retrieve a recipe with its ingredients, amounts, modifiers, and instructions
        SELECT 
            r.RecipeID,
            r.RecipeName,
            r.Description AS RecipeDescription,
            r.PrepTime,
            r.CookTime,
            r.Servings,
            r.Instructions,
            i.Name AS IngredientName,
            ri.Quantity * ISNULL(rim.ScaleFactor, 1) AS ScaledQuantity,
            ri.UnitOfMeasure,
            im.ModifierName AS IngredientModifier
        FROM 
            tblRecipes r
            JOIN tblRecipeIngredientModifier rim ON r.RecipeID = rim.RecipeID  -- Join recipes with recipe-ingredient-modifier bridge
            JOIN tblIngredients ri ON rim.IngredientID = ri.IngredientID        -- Join recipe-ingredient-modifier bridge with ingredients
            JOIN tblInventory i ON ri.InventoryID = i.InventoryID               -- Join ingredients with inventory (ingredient details)
            LEFT JOIN tblIngredientModifiers im ON rim.ModifierID = im.ModifierID  -- Optionally join with modifiers
        WHERE 
            r.RecipeID = '${recipeID}';  -- Filter by specific recipe ID`;

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(query).then((result) => {
                    res.status(200).send(
                        {
                        status: "success",
                        recipe_full: result.recordset
                        }
                    );
                }).catch((e) => {
                    console.log(e);
                    return_500(res);})
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.log(e);
            return_500(res);
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});


//add a recipe ingredient
app.post('/add_recipe_ingredient', async (req, res) => {
    const recipeID = req.header("recipeID");
    const ingredientID = req.header("ingredientID");
    const modifierID = req.header("modifierID");
    const scaleFactor = req.header("scaleFactor");

    //validate the request
    if (recipeID === undefined || ingredientID === undefined || modifierID === undefined || scaleFactor === undefined) {
        return_400(res, "Bad request");
        return;
    }

    const query = `INSERT INTO tblRecipeIngredientModifier (RecipeID, IngredientID, ModifierID, ScaleFactor) VALUES ('${recipeID}', '${ingredientID}', '${modifierID}', '${scaleFactor}')`;
    
    try {
        const session_id = req.header("session_id");

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(query).then((result) => {
                    res.status(200).send(
                        {
                        status: "success",
                        recipe: result.recordset
                        }
                    );
                }).catch((e) => {
                    console.log(e);
                    return_500(res);})
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.log(e);
            return_500(res);
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

//returns all recipes ingredients
app.get("/recipe_ingredients", async (req, res) => {
    const query = `SELECT * FROM tblRecipeIngredientModifier`;

    try {
        const session_id = req.header("session_id");

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(query).then((result) => {
                    res.status(200).send(
                        {
                        status: "success",
                        recipe: result.recordset
                        }
                    );
                }).catch((e) => {
                    console.log(e);
                    return_500(res);})
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.log(e);
            return_500(res);
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

module.exports = app;