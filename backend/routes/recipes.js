//$env:NODE_ENV="development"; node index.js
//docker compose up -d database
//docker compose stop
//docker compose pull
//docker run -p 3000:3000 docker-image
//docker buildx build -t docker-image .


// try {
//     const session_id = req.header("session_id");


//     database.sessionToEmployeeID(session_id).then((employee_id) => {
//         if (employee_id) {
//             database.executeQuery(query).then((result) => {
//                 res.status(200).send(
//                     {
//                     status: "success",
//                     recipe: result.recordset
//                     }
//                 );
//             }).catch((e) => {
//                 console.log(e);
//                 return_500(res);})
//         }
//         else {
//             return_498(res);
//         }
//     }).catch((e) => {
//         console.log(e);
//         return_500(res);
//     });
// }
// catch (e) {
//     if (e instanceof TypeError) {
//         return_400(res, "Invalid query parameters");
//     }
//     else {
//         return_500(res);
//     }
// }




const bodyParser = require('body-parser');
const express = require('express');
const {return_500, return_400, return_498} = require('./codes')
//this is for using uuids in the request
const { v4 } = require('uuid');

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// API routes (not worrying about session yet)

//get a recipe by ID (also returns the associated ingredients)
app.put("/update_recipe/:recipeID", async (req, res) => {
    try {
        const session_id = req.header("session_id");

        if (req.params.recipeID === undefined) {
            return_400(res, "Bad request");
            return;
        }
        const recipeID = req.params.recipeID;
        const now = new Date();
        // Format the date into SQL-friendly format (YYYY-MM-DD HH:MM:SS)
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
        
        const query = `
        UPDATE tblRecipes
        SET 
            RecipeName = '${req.body.RecipeName}', 
            Description = '${req.body.Description}', 
            Category = '${req.body.Category}', 
            PrepTime = '${req.body.PrepTime}', 
            CookTime = '${req.body.CookTime}', 
            Servings = '${req.body.Servings}', 
            Instructions = '${req.body.Instructions}', 
            UpdatedAt = GETDATE()
        WHERE RecipeID = '${recipeID}'
        `;
    
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

app.get("/recipe/:recipeID", async (req, res) => {
    try {
        const session_id = req.header("session_id");
        if (req.params.recipeID === undefined) {
            return_400(res, "Bad request");
            return;
        }
        const recipeID = req.params.recipeID;
        const query = `SELECT * FROM tblRecipes WHERE RecipeID = '${recipeID}'`;

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

app.get('/recipe/:recipe_id/ingredients', (req, res) => {
    try {
        const recipeId = req.params.recipe_id;
        const session_id = req.header("session_id");

        // Validate recipeId and session_id
        if (!recipeId) {
            return res.status(400).send({ status: "error", reason: "Missing recipe_id in URL" });
        }
        else if (!recipeId.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid inventory_id format")
        }

        if (session_id === undefined) {
            return res.status(403).send({
                status: "error",
                reason: "Missing session_id in headers"
            });
        }

        // Fetch employee ID from the session
        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                // Directly insert recipeId into the query
                const query = `
                    SELECT 
                        i.IngredientID, 
                        iv.Name AS InventoryName, 
                        i.Quantity, 
                        i.UnitOfMeasure,
                        i.InventoryID
                    FROM 
                        tblIngredients AS i
                    JOIN 
                        tblRecipeIngredientModifier AS rim ON i.IngredientID = rim.IngredientID
                    JOIN 
                        tblInventory AS iv ON i.InventoryID = iv.InventoryID
                    WHERE 
                        rim.RecipeID = '${recipeId}'  -- Directly inserting recipeId
                `;

                // Execute the query
                database.executeQuery(query).then((result) => {
                    // Make sure that there are results
                    if (result.rowsAffected > 0) {
                        // Respond with the list of ingredients
                        const ingredients = result.recordsets[0];
                        res.status(200).send({
                            status: "success",
                            ingredients: ingredients.map(({ IngredientID, InventoryName, Quantity, UnitOfMeasure, InventoryID }) => ({
                                ingredientId: IngredientID,
                                inventoryName: InventoryName,
                                quantity: Quantity,
                                unit: UnitOfMeasure,
                                inventoryId: InventoryID
                            }))
                        });
                    } else {
                        res.status(404).send({
                            status: "error",
                            reason: "No ingredients found for this recipe"
                        });
                    }
                }).catch((e) => {
                    console.error(e);
                    return_500(res);
                });
            } else {
                return_498(res);
            }
        }).catch((e) => {
            console.error(e);
            return_500(res);
        });
    } catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        } else {
            return_500(res);
        }
    }
});


app.delete("/delete_recipe/:recipeID", async (req, res) => {
        const session_id = req.header("session_id");
        if (req.params.recipeID === undefined) {
            return_400(res, "Bad request");
            return;
        }
        const recipeID = req.params.recipeID;
        try {
            database.sessionToEmployeeID(session_id).then(async (employee_id) => {
                if (employee_id) {
                const deleteModifierQuery = `
                    DELETE FROM tblRecipeIngredientModifier
                    WHERE RecipeID = '${recipeID}';
                `;
                await database.executeQuery(deleteModifierQuery);
        
                const deleteIngredientQuery = `
                    DELETE FROM tblIngredients
                    WHERE IngredientID IN (
                        SELECT IngredientID FROM tblRecipeIngredientModifier
                        WHERE RecipeID = '${recipeID}'
                    );
                `;
                await database.executeQuery(deleteIngredientQuery);
        
                const deleteRecipeQuery = `
                    DELETE FROM tblRecipes
                    WHERE RecipeID = '${recipeID}';
                `;
                const result = await database.executeQuery(deleteRecipeQuery);
                res.status(200).send({
                    status: "success",
                    message: `Recipe with ID ${recipeID} deleted successfully.`
                });
            }})
        } catch (error) {
            console.log(error);
            return_500(res);
        }
    });

//add a recipe
app.post('/add_recipe', async (req, res) => {
    const recipeID = database.gen_uuid();

    const now = new Date();
    // Format the date into SQL-friendly format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    //validate the request
    if (req.body.RecipeName === undefined || req.body.Description === undefined || req.body.Category === undefined || req.body.PrepTime === undefined || req.body.CookTime === undefined || req.body.Servings === undefined || req.body.Instructions === undefined) {
        return_400(res, "Bad request");
        return;
    }
    const query = `INSERT INTO tblRecipes (RecipeID, RecipeName, Description, Category, PrepTime, CookTime, Servings, Instructions, CreatedAt) VALUES ('${recipeID}', '${req.body.RecipeName}', '${req.body.Description}', '${req.body.Category}', '${req.body.PrepTime}', '${req.body.CookTime}', '${req.body.Servings}', '${req.body.Instructions}', GETDATE())`;
    
    try {
        const session_id = req.header("session_id");

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(query).then((result) => {
                    res.status(200).send(
                        {
                        status: "success",
                        recipeID: recipeID,
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

//returns all recipes
app.get("/recipes", async (req, res) => {
    const query = `SELECT * FROM tblRecipes`;

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
},)

    app.post('/add_recipe_ingredient_full', async (req, res) => {
        try {
            const sessionId = req.header("session_id");
            const recipeId = req.header("recipe_id");
            const inventory_id = req.header("inventory_id");
            const quantity = req.header("quantity");
            const unit_of_measurement = req.header("unit_of_measure");
            const scaleFactor = req.header("scale_factor") || 1;
            const modifierId = req.header("modifier_id") || null;

            // Validate headers
            if (!sessionId) {
                return res.status(403).send({
                    status: "error",
                    reason: "Missing session_id in headers"
                });
            }
            if (!recipeId) {
                return res.status(400).send({ status: "error", reason: "Missing recipe_id in headers" });
            }
            else if (!recipeId.match(/^\w{0,32}$/)) {
                return_400(res, "Invalid recipeId format")
            }
            if (!quantity || isNaN(quantity)) {
                return res.status(400).send({ status: "error", reason: "Quantity must be a valid number" });
            }
            if (!unit_of_measurement) {
                return res.status(400).send({ status: "error", reason: "Missing unit_of_measure in headers" });
            }
            else if (!unit_of_measurement.match(/^\w{0,32}$/)) {
                return_400(res, "Invalid unit_of_measurement format")
            }
            if (!inventory_id.match(/^\w{0,32}$/)) {
                return_400(res, `Invalid inventory_id format ${inventory_id}`);
            }

            const ingredient_id = database.gen_uuid();

            const employeeId = await database.sessionToEmployeeID(sessionId);
            if (!employeeId) {
                return res.status(403).send({ status: "error", reason: "Invalid session_id" });
            }

            // Insert into tblIngredients
            const insertIngredientQuery = `
            INSERT INTO tblIngredients (IngredientID, InventoryID, Quantity, UnitOfMeasure)
                         VALUES ('${ingredient_id}', '${inventory_id}', ${quantity}, '${unit_of_measurement}')`;

            await database.executeQuery(insertIngredientQuery);

            // Insert into tblRecipeIngredientModifier using string interpolation
            const insertModifierQuery = `
            INSERT INTO tblRecipeIngredientModifier (RecipeID, IngredientID, ModifierID, ScaleFactor)
            VALUES ('${recipeId}', '${ingredient_id}', '', ${scaleFactor})
        `;

            await database.executeQuery(insertModifierQuery);

            // Respond with success
            res.status(201).send({
                status: "success",
                ingredient_id: ingredient_id
            });

        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", reason: error.message });
        }
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

module.exports = app;