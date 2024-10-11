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
const {uuid} = require('uuidv4');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// API routes (not worrying about session yet)

app.post('/add_task', async (req, res) => {
    const taskID = database.gen_uuid();

    const now = new Date();
    // Format the date into SQL-friendly format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    //validate the request
    if (req.body.RecipeID === null || req.body.AmountToBake === null || req.body.AssignedEmployeeID === null) {
        return_400(res, "Bad request");
        return;
    }

    const query = `INSERT INTO tblTasks (TaskID, RecipeID, AmountToBake, DueDate, AssignedEmployeeID)
                   VALUES ('${taskID}', '${req.body.RecipeID}', '${req.body.AmountToBake}', '${req.body.DueDate}',
                           '${req.body.AssignedEmployeeID}')`;
    console.log(query)
    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "success",
            taskID: taskID
            // users: result.recordset
        });
        //log results
        console.log(result);
    }).catch((e) => {
        console.log(e);
        return_500(res);
    });
});

app.get("/tasks", async (req, res) => {
    const query = `SELECT TaskID, tT.RecipeID, AssignedEmployeeID AS EmployeeID, RecipeName, AmountToBake, Status, AssignmentDate, DueDate
                   FROM tblTasks AS tT
                            INNER JOIN tblRecipes AS tR ON tT.RecipeID = tR.RecipeID
                   ORDER BY DueDate`;
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

app.get("/task/:taskID", async (req, res) => {
    if (!req.params.taskID) {
        return_400(res, "Bad request");
        return;
    }
    const taskID = req.params.taskID;
    const query = `SELECT *
                   FROM tblTasks
                   WHERE TaskID = '${taskID}'`;

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

app.delete("/delete_task/:taskID", async (req, res) => {
    if (!req.params.taskID) {
        return_400(res, "Bad request");
        return;
    }
    const taskID = req.params.taskID;
    const query = `
        DELETE
        FROM tblTasks
        WHERE TaskID = '${taskID}';
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

app.put("/update_task/:taskID", async (req, res) => {
    const taskID = req.params.taskID;
    const now = new Date();
    // Format the date into SQL-friendly format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    const query = `
        UPDATE tblTasks
        SET RecipeID           = '${req.body.RecipeID}',
            AmountToBake       = '${req.body.AmountToBake}',
            Status             = '${req.body.Status}',
            DueDate            = '${req.body.DueDate}',
            CompletionDate     = '${req.body.CompletionDate}',
            AssignedEmployeeID = '${req.body.AssignedEmployeeID}'
        WHERE TaskID = '${taskID}'
    `;

    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "successful update",
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

module.exports = app;