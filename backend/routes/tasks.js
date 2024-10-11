//$env:NODE_ENV="development"; node index.js
//docker compose up -d database
//docker compose stop
//docker compose pull
//docker run -p 3000:3000 docker-image
//docker buildx build -t docker-image .

const bodyParser = require('body-parser');
const express = require('express');
const {return_500, return_400, return_498} = require('./codes')

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

// Max that the database will hold
const decimal_10_whole_2_fraction = 999_999_999.99;

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// API routes (not worrying about session yet)

app.post('/add_task', async (req, res) => {
    const sessionID = req.headers["session_id"];
    const taskID = database.gen_uuid();
    const recipe_id = req.body["RecipeID"];
    const amount_to_bake = req.body["AmountToBake"];
    const assigned_employee_id = req.body["AssignedEmployeeID"];
    const comments = req.body["Comments"];
    const commentID = database.gen_uuid();
    const dueDate = req.body["DueDate"];

    console.log(req.body)
    const test_date = new Date(dueDate);

    if (sessionID === undefined) {
        res.status(403).send(
            {
                status: "error",
                reason: "Missing session_id in headers"
            }
        );
    }
    else if (recipe_id === undefined) {
        return_400(res, "Missing RecipeID in body");
    }
    else if (amount_to_bake === undefined) {
        return_400(res, "Missing AmountToBake in body");
    }
    else if (assigned_employee_id === undefined) {
        return_400(res, "Missing AssignedEmployeeID in body")
    }
    // VARCHAR(MAX) is up to 2^31-1 bytes, so the bee movie script shouldn't break this
    else if (comments !== undefined && !comments.match(/^[\w\s.,*/]+$/) && comments.length < 2 ** 31 - 1) {
        return_400(res,
            "Invalid comments supplied. Make sure you're validating that correctly before sending it."
        );
    }
    // TODO: Drop tables and revalidate with hyphen removed from the regex and length changed to 32
    else if (!recipe_id.match(/^[\w-]{0,36}$/)) {
        return_400(res, "Invalid RecipeID supplied");
    }
    else if (amount_to_bake > decimal_10_whole_2_fraction) {
        return_400(res,
            `AmountToBake too large. Make sure that it is less than ${decimal_10_whole_2_fraction}`
        );
    }
    else if (amount_to_bake <= 0) {
        return_400(res, "AmountToBake too small. You can't unbake product.");
    }
    else if (!assigned_employee_id.match(/\w{1,50}/)) {
        return_400(res, "Invalid EmployeeID format");
    }
    else if (test_date.toString() === "Invalid Date" || isNaN(test_date.getTime()) || test_date.toISOString() !== dueDate) {
        return_400(res, "Invalid date provided")
    }
    else {
        database.sessionToEmployeeID(sessionID).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(
                    `INSERT INTO tblTasks (TaskID, RecipeID, AmountToBake, DueDate, AssignedEmployeeID)
                     VALUES ('${taskID}', '${recipe_id}', '${amount_to_bake}', '${req.body.DueDate}',
                             '${req.body.AssignedEmployeeID}')`
                ).then((result) => {
                    if (comments !== undefined) {
                        database.executeQuery(
                            `INSERT INTO tblTaskComments (CommentID, TaskID, EmployeeID, CommentText)
                             VALUES ('${commentID}', '${taskID}', '${assigned_employee_id}', '${comments}')`
                        ).then((result) => {
                            res.status(201).send(
                                {
                                    status: "success",
                                    taskID: taskID,
                                    commentID: commentID
                                }
                            );
                        }).catch((e) => {
                            console.error(e);
                            return_500(res);
                        });
                    }
                    else {
                        res.status(200).send({
                            status: "success",
                            taskID: taskID
                        });
                    }
                }).catch((e) => {
                    console.error(e);
                    return_500(res);
                });
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.error(e);
            return_500(res);
        })
    }
});

app.get("/tasks", async (req, res) => {
    const query = `SELECT tT.TaskID,
                          tT.RecipeID,
                          AssignedEmployeeID AS EmployeeID,
                          RecipeName,
                          AmountToBake,
                          Status,
                          AssignmentDate,
                          DueDate,
                          CommentText        AS Comments
                   FROM tblTasks AS tT
                            INNER JOIN tblRecipes AS tR ON tT.RecipeID = tR.RecipeID
                            LEFT JOIN tblTaskComments AS tTC ON tT.TaskID = tTC.TaskID
                   WHERE Status <> 'Completed'
                   ORDER BY DueDate`;
    const sessionid = req.headers['session_id'];

    database.executeQuery(query).then((result) => {
        res.status(200).send({
            status: "success",
            recipes: result.recordset
        });
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
    }).catch((e) => {
        console.error(e);
        return_500(res);
    });


});

module.exports = app;