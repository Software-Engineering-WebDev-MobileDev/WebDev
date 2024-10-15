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
const decimal_10_whole_2_fraction = 99_999_999.99;

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.post('/add_task', async (req, res) => {
    try {
        const sessionID = req.headers["session_id"];
        const taskID = database.gen_uuid();
        const recipe_id = req.body["RecipeID"];
        const amount_to_bake = req.body["AmountToBake"];
        const assigned_employee_id = req.body["AssignedEmployeeID"];
        const comments = req.body["Comments"];
        const commentID = database.gen_uuid();
        const dueDate = req.body["DueDate"];

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
        else if (comments !== undefined && !comments.match(/^[\w\s\r.,\-!:;?+=#@$%&^()\[\]"*\/]+$/g) && comments.length < 2 ** 31 - 1) {
            return_400(res,
                "Invalid comments supplied. Make sure you're validating that correctly before sending it."
            );
        }
        else if (!recipe_id.match(/^\w{0,32}$/)) {
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
                    ).then(() => {
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
                            res.status(201).send({
                                status: "success",
                                taskID: taskID
                            });
                        }
                    }).catch((e) => {
                        if (e.message.startsWith("The INSERT statement conflicted with the FOREIGN KEY constraint \"FK__tblTasks__Recipe")) {
                            return_400(res, "Invalid recipe id");
                        }
                        if (e.message.startsWith("The INSERT statement conflicted with the FOREIGN KEY constraint \"FK__tblTasks__Assign")) {
                            return_400(res, "Invalid employee id");
                        }
                        else {
                            console.error(e);
                            return_500(res);
                        }
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

app.get("/tasks", async (req, res) => {
    try {
        const query = `SELECT tT.TaskID,
                              tT.RecipeID,
                              AssignedEmployeeID AS EmployeeID,
                              RecipeName,
                              AmountToBake,
                              Status,
                              AssignmentDate,
                              DueDate,
                              CommentText        AS Comments,
                              CommentID,
                              CompletionDate
                       FROM tblTasks AS tT
                                INNER JOIN tblRecipes AS tR ON tT.RecipeID = tR.RecipeID
                                LEFT JOIN tblTaskComments AS tTC ON tT.TaskID = tTC.TaskID
                       WHERE (CompletionDate >= DATEADD(day, -7, GETDATE()) OR CompletionDate IS NULL)
                       ORDER BY DueDate`;
        const session_id = req.headers['session_id'];

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(query).then((result) => {
                        res.status(200).send({
                            status: "success",
                            recipes: result.recordset
                        });
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
            });
        }
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

app.get("/task/:taskID", async (req, res) => {
    try {
        const session_id = req.headers['session_id'];
        const taskID = req.params.taskID;

        if (!req.params.taskID) {
            return_400(res, "Missing taskID");
        }
        else if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (!taskID.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid taskID format")
        }
        else {
            const query = `SELECT *
                           FROM tblTasks
                           WHERE TaskID = '${taskID}'`;

            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(query).then((result) => {
                        res.status(200).send({
                            status: "success",
                            recipe: result.recordset
                        });
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else {
                    return_498(res);
                }
            })
        }
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

app.delete("/delete_task/:taskID", async (req, res) => {
    try {
        const taskID = req.params.taskID;
        const session_id = req.headers["session_id"];
        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (!req.params.taskID) {
            return_400(res, "Bad request");

        }
        else if (!taskID.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid taskID format")
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    const query = `
                        DELETE
                        FROM tblTasks
                        WHERE TaskID = '${taskID}';
                    `;
                    database.executeQuery(query).then(() => {
                        res.status(200).send({
                            status: "success"
                        });
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

app.put("/update_task/:taskID", async (req, res) => {
    const task_id = req.params.taskID;

    const session_id = req.headers["session_id"];
    const recipe_id = req.body["RecipeID"];
    const amount_to_bake = req.body["AmountToBake"];
    const assigned_employee_id = req.body["AssignedEmployeeID"];
    const comments = req.body["Comments"];
    const comment_id = req.body["CommentID"];
    const dueDate = req.body["DueDate"];
    const status = req.body["Status"];

    const test_date = new Date(dueDate);

    if (session_id === undefined) {
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
    else if (comment_id !== undefined && !comment_id.match(/^\w{0,32}$/)) {
        return_400(res, "Invalid CommentID format");
    }
    // VARCHAR(MAX) is up to 2^31-1 bytes, so the bee movie script shouldn't break this. Just might be a touch slow
    else if (comments !== undefined && !comments.match(/^[\w\s\r.,\-!:;?+=#@$%&^()\[\]"*\/]+$/g) && comments.length < 2 ** 31 - 1) {
        return_400(res,
            "Invalid comments supplied. Make sure you're validating that correctly before sending it."
        );
    }
    else if (!recipe_id.match(/^\w{0,32}$/)) {
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
    else if (!task_id.match(/^\w{0,32}$/)) {
        return_400(res, "Invalid taskID format")
    }
    else if (status !== "Pending" && status !== "Completed" && status !== "In Progress") {
        return_400(res, "Invalid task status");
    }
    else {
        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                const query = `
                    UPDATE tblTasks
                    SET RecipeID           = '${recipe_id}',
                        AmountToBake       = '${amount_to_bake}',
                        Status             = '${status}',
                        DueDate            = '${dueDate}',
                        CompletionDate     = GETDATE(),
                        AssignedEmployeeID = '${assigned_employee_id}'
                    WHERE TaskID = '${task_id}'
                `;

                database.executeQuery(query).then((result) => {
                    if (result.rowsAffected[0] > 0) {
                        if (comment_id === undefined && comments) {
                            database.executeQuery(
                                `INSERT INTO tblTaskComments (CommentID, TaskID, EmployeeID, CommentText)
                                 VALUES ('${database.gen_uuid()}', '${task_id}', '${employee_id}', '${comments}')`
                            ).then(() => {
                                res.status(201).send(
                                    {
                                        status: "success"
                                    }
                                );
                            }).catch((e) => {
                                console.error(e);
                                return_500(res);
                            });
                        }
                        else if (comment_id && comments === undefined) {
                            database.executeQuery(
                                `DELETE
                                 FROM tblTaskComments
                                 WHERE CommentID = '${comment_id}'`
                            ).then(() => {
                                res.status(200).send(
                                    {
                                        status: "success"
                                    }
                                );
                            }).catch((e) => {
                                console.error(e);
                                return_500(res);
                            });
                        }
                        else if (comment_id && comments) {
                            database.executeQuery(
                                `UPDATE tblTaskComments SET CommentText = '${comments}' WHERE CommentID = '${comment_id}'`
                            ).then(() => {
                                res.status(200).send(
                                    {
                                        status: "success"
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
                            });
                        }
                    }
                    else {
                        return_500(res, "Something went wrong on that update. Try creating the task?")
                    }
                }).catch((e) => {
                    if (e.message.startsWith("The UPDATE statement conflicted with the FOREIGN KEY constraint \"FK__tblTasks__Assign")) {
                        return_400(res, "Invalid employee id");
                    }
                    else if (e.message.startsWith("The UPDATE statement conflicted with the FOREIGN KEY constraint \"FK__tblTasks__Recipe")) {
                        return_400(res, "Invalid recipe id");
                    }
                    else {
                        console.error(e);
                        return_500(res);
                    }
                });
            }
            else {
                return_498(res);
            }
        })
    }
});

app.post('/task_complete', (req, res) => {
    try {
        const session_id = req.headers["session_id"];
        const task_id = req.headers["task_id"];
        const task_status = req.headers["task_status"];


        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (!task_id.match(/^\w{0,32}$/)) {
            return_400(res, "Invalid task_id supplied");
        }
        else if (task_status !== "Pending" &&  task_status !== "Completed" && task_status !== "In Progress" && task_status !== undefined) {
            return_400(res, "Invalid task status");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    const newStatus = task_status !== undefined ? task_status : "Completed";
                    const completionDate = newStatus === "Completed" ? "GETDATE()" : null;
                    database.executeQuery(
                        `UPDATE tblTasks
                         SET Status             = '${newStatus}',
                             CompletionDate = ${completionDate}
                         WHERE TaskID = '${task_id}';
                        INSERT INTO tblTaskStatusAudit (StatusAuditID, TaskID, OldStatus, NewStatus,
                                                        StatusChangedByEmployeeID)
                        VALUES ('${database.gen_uuid()}', '${task_id}', 'Pending', 'Completed', '${employee_id}')`
                    ).then(() => {
                        res.status(200).send(
                            {
                                status: "success"
                            }
                        );
                    }).catch((e) => {
                        console.error(e);
                        return_500(res);
                    });
                }
                else {
                    return_498(res);
                }
            })
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
})

module.exports = app;