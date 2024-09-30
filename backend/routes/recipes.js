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
app.put("/update_recipe/:recipeID", async (req, res) => {
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
        UpdatedAt = '${formattedDate}'
    WHERE RecipeID = '${recipeID}'
    `;

    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "successful update",
            updatedAt: formattedDate
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

app.get("/recipe/:recipeID", async (req, res) => {
    if (!req.params.recipeID) {
        return_400(res, "Bad request");
        return;
    }
    const recipeID = req.params.recipeID;
    const query = `SELECT * FROM tblRecipes WHERE RecipeID = '${recipeID}'`;
    
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

app.delete("/delete_recipe/:recipeID", async (req, res) => {
    if (!req.params.recipeID) {
        return_400(res, "Bad request");
        return;
    }
    const recipeID = req.params.recipeID;
    // const query = `SELECT * FROM tblRecipes WHERE RecipeID = '${recipeID}'`;
    const query = `
    DELETE FROM tblRecipes
    WHERE RecipeID = '${recipeID}';
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
    if (req.body.RecipeName === null || req.body.Description === null || req.body.Category === null || req.body.PrepTime === null || req.body.CookTime === null || req.body.Servings === null || req.body.Instructions === null) {
        return_400(res, "Bad request");
        return;
    }
    const query = `INSERT INTO tblRecipes (RecipeID, RecipeName, Description, Category, PrepTime, CookTime, Servings, Instructions, CreatedAt) VALUES ('${recipeID}', '${req.body.RecipeName}', '${req.body.Description}', '${req.body.Category}', '${req.body.PrepTime}', '${req.body.CookTime}', '${req.body.Servings}', '${req.body.Instructions}', '${formattedDate}')`;
    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "success",
            recipeID: recipeID,
            createdAt: formattedDate
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

module.exports = app;