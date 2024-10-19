/**
 * Code for rendering the task interface.
 */

// User's session_id to be used
const sessionID = localStorage.getItem('session_id');

/**
 * Renders the "Add a task" page.
 * @returns {HTMLDivElement} The div of the "Add a task" page to be appended to the content container.
 */
function renderAddTask() {
    /*
     * Make the task table
     */
    let currentDiv
    currentDiv = document.createElement('div');
    currentDiv.style.alignContent = "center";
    currentDiv.className = "container-fluid task-form";
    const tableTaskContainer = document.createElement('table');
    tableTaskContainer.id = "taskContainer";
    tableTaskContainer.className = "table";
    tableTaskContainer.hidden = true;
    tableTaskContainer.style.backgroundColor = "#ffffffd1"
    currentDiv.appendChild(tableTaskContainer);
    contentContainer.appendChild(currentDiv);

    /*
     * Make the task addition form
     */

    currentDiv = document.createElement('div');
    currentDiv.id = "taskFormContainer";
    currentDiv.className = "container-fluid task-form";
    currentDiv.hidden = true;
    currentDiv.style.alignContent = "center";

    // Heading
    const tFCHeading = document.createElement('h1');
    tFCHeading.style.fontWeight = "bold";
    tFCHeading.innerText = "Create Task";
    currentDiv.appendChild(tFCHeading);

    const tFCForm = document.createElement('form');

    // Recipe ID label
    const tFCRecipeIDLabel = document.createElement('label');
    tFCRecipeIDLabel.htmlFor = "recipeIDForm";
    tFCRecipeIDLabel.className = "control-label";
    tFCRecipeIDLabel.id = "recipeIDFormLabel";
    tFCRecipeIDLabel.innerText = "Recipe";
    tFCForm.appendChild(tFCRecipeIDLabel);

    // Recipe ID Select
    const tFCRecipeIDSelect = document.createElement('select');
    tFCRecipeIDSelect.className = "form-control";
    tFCRecipeIDSelect.id = "recipeIDForm";
    tFCRecipeIDSelect.name = "recipeIDForm";
    tFCRecipeIDSelect.required = true;
    tFCRecipeIDSelect.ariaRequired = "true";
    tFCForm.appendChild(tFCRecipeIDSelect);
    tFCForm.appendChild(document.createElement('br'));

    // Amount to bake label
    const tFCAmountToBakeLabel = document.createElement('label');
    tFCAmountToBakeLabel.htmlFor = "amountToBake";
    tFCAmountToBakeLabel.className = "control-label";
    tFCAmountToBakeLabel.id = "amountToBakeLabel";
    tFCAmountToBakeLabel.innerText = "Total Amount";
    tFCForm.appendChild(tFCAmountToBakeLabel);

    // Amount to bake input
    const tFCAmountToBakeInput = document.createElement('input');
    tFCAmountToBakeInput.id = "amountToBake";
    tFCAmountToBakeInput.className = "form-control";
    tFCAmountToBakeInput.type = "number";
    tFCAmountToBakeInput.placeholder = "0";
    tFCAmountToBakeInput.min = "1";
    tFCAmountToBakeInput.max = "999999999";
    tFCAmountToBakeInput.required = true;
    tFCAmountToBakeInput.ariaRequired = "true";
    tFCForm.appendChild(tFCAmountToBakeInput);
    tFCForm.appendChild(document.createElement('br'));

    // Due date label
    const tFCDueDateLabel = document.createElement('label');
    tFCDueDateLabel.htmlFor = "dueDate";
    tFCDueDateLabel.className = "control-label";
    tFCDueDateLabel.innerText = "Due Date";
    tFCForm.appendChild(tFCDueDateLabel);

    // Due date input
    const tFCDueDateInput = document.createElement('input');
    tFCDueDateInput.type = "date";
    tFCDueDateInput.id = "dueDate";
    tFCDueDateInput.className = "form-control";
    tFCDueDateInput.required = true;
    tFCDueDateInput.ariaRequired = "true";
    tFCForm.appendChild(tFCDueDateInput);
    tFCForm.appendChild(document.createElement('br'));

    // Assignee label
    const tFCAssigneeLabel = document.createElement('label');
    tFCAssigneeLabel.htmlFor = "assignedEmployeeID";
    tFCAssigneeLabel.className = "control-label";
    tFCAssigneeLabel.innerText = "Assignee";
    tFCForm.appendChild(tFCAssigneeLabel);

    // Assignee form
    const tFCAssigneeForm = document.createElement('input');
    tFCAssigneeForm.type = "text";
    tFCAssigneeForm.id = "assignedEmployeeID";
    tFCAssigneeForm.minLength = 1;
    tFCAssigneeForm.maxLength = 50;
    tFCAssigneeForm.className = "form-control";
    tFCAssigneeForm.placeholder = "Type assignee's employee id...";
    tFCAssigneeForm.pattern = "\\w{1,50}";
    tFCAssigneeForm.title = "Employee id should be 1-50 letters or numbers";
    tFCAssigneeForm.required = true;
    tFCAssigneeForm.ariaRequired = "true";
    tFCForm.appendChild(tFCAssigneeForm);
    tFCForm.appendChild(document.createElement('br'));

    // Task notes label
    const tFCNotesLabel = document.createElement('label');
    tFCNotesLabel.htmlFor = "taskNotes";
    tFCNotesLabel.className = "control-label";
    tFCNotesLabel.innerText = "Notes:";
    tFCForm.appendChild(tFCNotesLabel);
    tFCForm.appendChild(document.createElement('br'));

    // Task notes textarea element
    const tFCNotesTA = document.createElement('textarea');
    tFCNotesTA.type = "text";
    tFCNotesTA.id = "taskNotes";
    tFCNotesTA.minLength = 0;
    tFCNotesTA.maxLength = 2 ** 31 - 1;
    tFCNotesTA.className = "form-control";
    tFCNotesTA.placeholder = "Enter any notes for this task...";
    tFCForm.appendChild(tFCNotesTA);
    tFCForm.appendChild(document.createElement('br'));

    // Button div
    const tFCButtonDiv = document.createElement('div');
    tFCButtonDiv.align = "center";

    // Submit button
    const tFCSubmit = document.createElement('button');
    tFCSubmit.type = "button";
    tFCSubmit.className = "form-control btn btn-primary col-12 mt-4";
    tFCSubmit.style.width = "50%";
    tFCSubmit.style.marginBottom = "1em";
    tFCSubmit.id = "submitTaskButton";
    tFCSubmit.innerText = "Submit";
    tFCButtonDiv.appendChild(tFCSubmit);
    tFCButtonDiv.appendChild(document.createElement('br'));

    // Back button
    const tFCBackButton = document.createElement('span');
    tFCBackButton.id = "taskFormBackButton";
    tFCBackButton.className = "brown-text";
    tFCBackButton.role = "button";
    tFCBackButton.tabIndex = 0;
    tFCBackButton.innerHTML = "<strong>Back</strong>";
    tFCButtonDiv.appendChild(tFCBackButton);


    currentDiv.appendChild(tFCForm);
    currentDiv.appendChild(tFCButtonDiv);
    return currentDiv;
}

/*
 * Render the initial page
 */
const contentContainer = document.getElementById('contentContainer');

// Create the task add button
let currentDiv = document.createElement('div');
currentDiv.align = "center";

// Then make the button
const tABButton = document.createElement('button');
tABButton.className = "btn btn-primary col-10 mt-4";
tABButton.id = "taskAddButton";
tABButton.name = "taskAddButton";
tABButton.type = "button";
tABButton.innerText = "Add a task";
currentDiv.appendChild(tABButton)
contentContainer.appendChild(currentDiv);

// Render the add task page
contentContainer.appendChild(renderAddTask());

// Finally, add the task viewer div
const tVDiv = document.createElement('div');
tVDiv.id = "taskViewer";
tVDiv.className = "container-fluid task-form";
tVDiv.style.alignContent = "center";
tVDiv.hidden = true;
tVDiv.ariaHidden = "true";

contentContainer.appendChild(tVDiv)


/*
 * Task list elements
 */

// Where tasks are placed
const taskBox = document.getElementById('taskContainer');

// Task list from the API
let taskList = [];

// List of Recipes
let recipeList = [];

/*
 * Task creation view elements
 */

// Add task button
const addTaskButton = document.getElementById('taskAddButton');

// Task form container
const taskFormContainer = document.getElementById('taskFormContainer');

// Recipe ID dropdown container
const recipeIDForm = document.getElementById('recipeIDForm');

/*
 * Task creation input form elements
 */

// Amount To Bake input
const amountToBake = document.getElementById('amountToBake');

// Input due date
const dueDate = document.getElementById('dueDate');

// Assigned employee id
const assignedEmployeeID = document.getElementById('assignedEmployeeID');

const taskNotes = document.getElementById('taskNotes');

// Button to send the task to the backend
const submitTaskButton = document.getElementById('submitTaskButton');

// Back button to return to the task view
const taskFormBackButton = document.getElementById('taskFormBackButton');

/*
 * Task viewer
 */

const taskViewer = document.getElementById('taskViewer');

/**
 * Gets a list of all the "Pending" tasks from the API
 * @returns {Promise<Response | [[{error: string}]]>} Returns the JSON response object from the API or "error"
 * @throws {Error} if the user is not logged in
 */
async function fetchTasks() {
    if (sessionID) {
        return fetch("/api/tasks",
            {
                method: "GET",
                headers: {
                    session_id: sessionID
                }
            }).then((response) => {
            if (response.status < 400) {
                return response.json();
            }
        }).catch((e) => {
            console.error(e);
            return [[{
                error: "error"
            }]];
        });
    }
    else {
        throw new Error("User is not logged in!");
    }
}

/**
 * Gets a list of recipes from the API
 * @returns {Promise<Response | [{error: string}]>} Returns the JSON response object from the API or "error"
 * if there was an error.
 * @throws {Error} if the user is not logged in
 */
async function fetchRecipes() {
    if (sessionID) {
        return fetch("/api/recipes",
            {
                method: "GET",
                headers: {
                    session_id: sessionID
                }
            }).then((response) => {
            if (response.status < 400) {
                return response.json();
            }
        }).catch((e) => {
            console.error(e);
            return [{
                error: "error"
            }];
        });
    }
    else {
        throw new Error("User is not logged in!");
    }
}

/**
 * Marks a task as completed.
 * @param sessionID {String} the session id to use for the API.
 * @param taskID {String} the task id to mark as completed.
 * @param taskStatus {String} the task's new status.
 * @returns {Promise<Response>} Nothing, await if needed.
 */
async function markComplete(sessionID, taskID, taskStatus) {
    return fetch('/api/task_complete', {
        method: "POST",
        headers: {
            session_id: sessionID,
            task_id: taskID,
            task_status: taskStatus
        }
    }).then(() => {
    }).catch((e) => {
        console.error(e);
    })
}

/**
 * Update a task with the API.
 * @param taskID {String} The id of the task to be updated.
 * @param RecipeID {String} The id of the recipe associated with this task.
 * @param AmountToBake {HTMLInputElement} The HTML input element for the amount to bake.
 * @param Status {String} The current status of the task.
 * @param DueDate {HTMLInputElement} The HTML date input element for the due date.
 * @param AssignedEmployeeID {HTMLInputElement} The HTML input element for the assigned employee's id.
 * @param Comments {HTMLTextAreaElement} The HTML text area element for the notes related to this task.
 * @param CommentID {String|undefined} The comment id (if any) associated with this task.
 * @returns {Promise<Response|string|string>}
 */
async function updateTask(taskID, RecipeID, AmountToBake, Status, DueDate, AssignedEmployeeID, Comments, CommentID) {
    /*
     * Little bit of validation
     */
    if (AmountToBake.value < 1) {
        Swal.fire("Amount to bake must be greater than 1!");
        return "error";
    }
    else if (AmountToBake.value > 99_999_999) {
        Swal.fire("That's way too much to bake, friend. Try a value lower than 999,999,999");
        return "error";
    }
    else if (!AssignedEmployeeID.value.match(/\w{1,50}/)) {
        Swal.fire("That's not a valid employee id format! Check your input and try again. Employee id should be 1-50 letters or numbers");
        return "error";
    }
    else if (sessionID) {
        // If there are comments and an ID, send them in the body
        if (Comments.value.length > 0 && CommentID) {
            return fetch(`/api/update_task/${taskID}`,
                {
                    method: "PUT",
                    headers: {
                        session_id: sessionID,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        RecipeID: RecipeID,
                        AmountToBake: AmountToBake.value,
                        DueDate: new Date(DueDate.value).toISOString(),
                        AssignedEmployeeID: AssignedEmployeeID.value,
                        Comments: Comments.value.replace(/'/g, '&quot;'),
                        CommentID: CommentID,
                        Status: Status
                    })
                }).then(async (response) => {
                    if (response.status < 400) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        let result = await response.json();
                        return result["reason"];
                    }
                    else {
                        console.error(await response.json());
                        return "error"
                    }
            }).catch(async (e) => {
                if (e.status === 400) {
                    let result = await e.json();
                    return result["reason"];
                }
                else {
                    console.error(e);
                    return "error";
                }
            });
        }
        // If the comments are new, indicate that by omission of the id
        else if (Comments.value.length > 0) {
            return fetch(`/api/update_task/${taskID}`,
                {
                    method: "PUT",
                    headers: {
                        session_id: sessionID,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        RecipeID: RecipeID,
                        AmountToBake: AmountToBake.value,
                        DueDate: new Date(DueDate.value).toISOString(),
                        AssignedEmployeeID: AssignedEmployeeID.value,
                        Comments: Comments.value.replace(/'/g, '&quot;'),
                        Status: Status
                    })
                }).then(async (response) => {
                    if (response.status < 400) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        let result = await response.json();
                        return result["reason"];
                    }
                    else {
                        console.error(await response.json());
                        return "error"
                    }
                }).catch(async (e) => {
                    if (e.status === 400) {
                        let result = await e.json();
                        return result["reason"];
                    }
                    else {
                        console.error(e);
                        return "error";
                    }
                });
        }
        else if (CommentID) {
            return fetch(`/api/update_task/${taskID}`,
                {
                    method: "PUT",
                    headers: {
                        session_id: sessionID,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        RecipeID: RecipeID,
                        AmountToBake: AmountToBake.value,
                        DueDate: new Date(DueDate.value).toISOString(),
                        AssignedEmployeeID: AssignedEmployeeID.value,
                        CommentID: CommentID,
                        Status: Status
                    })
                }).then(async (response) => {
                    if (response.status < 400) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        let result = await response.json();
                        return result["reason"];
                    }
                    else {
                        console.error(await response.json());
                        return "error"
                    }
                }).catch(async (e) => {
                    if (e.status === 400) {
                        let result = await e.json();
                        return result["reason"];
                    }
                    else {
                        console.error(e);
                        return "error";
                    }
                });
        }
        // Otherwise, just yeet the other stuff at the API
        else {
            return fetch(`/api/update_task/${taskID}`,
                {
                    method: "PUT",
                    headers: {
                        session_id: sessionID,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        RecipeID: RecipeID,
                        AmountToBake: AmountToBake.value,
                        DueDate: new Date(DueDate.value).toISOString(),
                        AssignedEmployeeID: AssignedEmployeeID.value,
                        Status: Status
                    })
                }).then(async (response) => {
                    if (response.status < 400) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        let result = await response.json();
                        return result["reason"];
                    }
                    else {
                        console.error(await response.json());
                        return "error"
                    }
            }).catch(async (e) => {
                if (e.status === 400) {
                    let result = await e.json();
                    return result["reason"];
                }
                else {
                    console.error(e);
                    return "error";
                }
            });
        }
    }
    else {
        return "error";
    }
}

/**
 * Callback function for rendering the task view interface.
 * @param task {Object} the task object (from the API) to render.
 * @param taskViewer {HTMLElement} the taskViewer div to render the interface in.
 * @param taskBox {HTMLElement} the main taskBox to hide after creating the page.
 * @param addTaskButton {HTMLElement} the addTaskButton to hide after creating the page.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function viewTask(task, taskViewer, taskBox, addTaskButton) {
    // Clear any previous contents of the task viewer
    taskViewer.innerHTML = '';
    const lineBreak = document.createElement("br");

    // Make the title
    const titleElement = document.createElement('h1');
    titleElement.innerText = `Make: ${task["RecipeName"]}`;
    titleElement.style.fontWeight = "bold";
    taskViewer.appendChild(titleElement);

    // Make the recipe element
    const recipeLabel = document.createElement('label');
    recipeLabel.htmlFor = "recipeClick";
    recipeLabel.className = "control-label";
    recipeLabel.innerText = "Recipe";
    taskViewer.appendChild(recipeLabel);

    const recipeRedirectButton = document.createElement('button');
    recipeRedirectButton.innerText = "Go to recipe";
    recipeRedirectButton.type = "button";
    recipeRedirectButton.className = "form-control";
    recipeRedirectButton.addEventListener(
        // mousedown?
        'mouseup',
        () => {
            // TODO: Make this redirect to the appropriate recipe page
            // window.location = `/recipes?recipe=${task["RecipeID"]}`
            console.log(`Should be going to /recipes?recipe=${task["RecipeID"]}`)
        }
    )
    taskViewer.appendChild(recipeRedirectButton);
    taskViewer.appendChild(lineBreak.cloneNode());

    // Make the recipe amount
    const recipeAmountLabel = document.createElement('label');
    recipeAmountLabel.htmlFor = "recipeAmount";
    recipeAmountLabel.className = "control-label";
    recipeAmountLabel.innerText = "Total Amount";
    taskViewer.appendChild(recipeAmountLabel);

    const recipeAmount = document.createElement('input');
    recipeAmount.id = "recipeAmount";
    recipeAmount.className = "form-control";
    recipeAmount.value = task["AmountToBake"];
    recipeAmount.type = "number";
    recipeAmount.max = "999999999.99";
    recipeAmount.min = "1";
    recipeAmount.required = true;
    recipeAmount.ariaRequired = "true";
    taskViewer.appendChild(recipeAmount);
    taskViewer.appendChild(lineBreak.cloneNode());

    // Make the due date
    const dueDateLabel = document.createElement('label');
    dueDateLabel.htmlFor = "recipeDueDate";
    dueDateLabel.className = "control-label";
    dueDateLabel.innerText = "Due Date";
    taskViewer.appendChild(dueDateLabel);

    const dueDate = document.createElement('input');
    dueDate.id = "recipeDueDate"
    dueDate.className = "form-control";
    dueDate.type = "date";
    dueDate.value = new Date(task["DueDate"]).toISOString().substring(0, 10);
    dueDate.required = true;
    dueDate.ariaRequired = "true";
    taskViewer.appendChild(dueDate);
    taskViewer.appendChild(lineBreak.cloneNode());

    // Make the assigned employee id
    const assignedEmployeeIDLabel = document.createElement('label');
    assignedEmployeeIDLabel.htmlFor = "recipeAssignedEmployeeID";
    assignedEmployeeIDLabel.className = "control-label";
    assignedEmployeeIDLabel.innerText = "Assignee";
    taskViewer.appendChild(assignedEmployeeIDLabel);

    const assignedEmployeeID = document.createElement('input');
    assignedEmployeeID.id = "recipeAssignedEmployeeID";
    assignedEmployeeID.className = "form-control";
    assignedEmployeeID.type = "text";
    assignedEmployeeID.value = task["EmployeeID"];
    assignedEmployeeID.maxLength = 50;
    assignedEmployeeID.minLength = 1;
    assignedEmployeeID.required = true;
    assignedEmployeeID.ariaRequired = "true";
    assignedEmployeeID.pattern = "\\w{1,50}";
    assignedEmployeeID.title = "Employee id should be 1-50 letters or numbers";
    taskViewer.appendChild(assignedEmployeeID);
    taskViewer.appendChild(lineBreak.cloneNode());

    // Make the notes
    const notesLabel = document.createElement('label');
    notesLabel.htmlFor = "recipeTaskNotes";
    notesLabel.className = "control-label";
    notesLabel.innerText = "Notes:";
    taskViewer.appendChild(notesLabel);

    const taskNotes = document.createElement('textarea');
    taskNotes.type = "text";
    taskNotes.id = "recipeTaskNotes";
    taskNotes.maxLength = 2 ** 31 - 1;
    taskNotes.minLength = 0;
    taskNotes.className = "form-control";
    if (task["Comments"]) {
        taskNotes.value = task["Comments"].replace(/&quot;/g, '\'');
    }
    else {
        taskNotes.placeholder = "No notes yet...";
    }
    taskViewer.appendChild(taskNotes);
    taskViewer.appendChild(lineBreak.cloneNode());

    // Div for buttons
    const buttonDiv = document.createElement('div');
    buttonDiv.align = "center";
    buttonDiv.style.display = "flex";
    buttonDiv.style.alignItems = "flex-end";
    buttonDiv.style.flexDirection = "row";
    buttonDiv.style.justifyContent = "center";

    // Update task button
    const updateButton = document.createElement('button');
    updateButton.type = "button";
    updateButton.className = "form-control btn btn-primary col-12 mt-4";
    updateButton.style.width = "40%";
    updateButton.style.marginBottom = "1em";
    updateButton.id = "updateTaskButton";
    updateButton.innerText = "Update Task";
    updateButton.addEventListener(
        'mousedown',
        async () => {
            let result = await updateTask(
                task["TaskID"],
                task["RecipeID"],
                document.getElementById('recipeAmount'),
                task["Status"],
                document.getElementById('recipeDueDate'),
                document.getElementById('recipeAssignedEmployeeID'),
                document.getElementById('recipeTaskNotes'),
                task["CommentID"]);

            if (result === "error") {
                // Hey, user, you've done messed up
                Swal.fire("Invalid task!");
            }
            else if (result === "Invalid employee id") {
                Swal.fire("Invalid assignee!");
            }
            else if (result === "Invalid recipe id") {
                Swal.fire("Invalid recipe!");
            }
            else {
                // Get the task list again
                taskList = [];
                await renderTasks();

                taskViewer.hidden = true;
                addTaskButton.hidden = false;
                taskBox.hidden = false;
            }
        }
    )
    buttonDiv.appendChild(updateButton);

    // Button spacer (a.k.a., a tab character)
    const buttonSpacer = document.createElement('p');
    buttonSpacer.innerHTML = "&emsp;";
    buttonDiv.appendChild(buttonSpacer);

    // Mark task done button
    const doneButton = document.createElement('button');
    doneButton.type = "button";
    doneButton.className = "form-control btn btn-primary col-12 mt-4";
    doneButton.style.width = "40%";
    doneButton.style.marginBottom = "1em";
    doneButton.id = "updateTaskButton";
    if (task["Status"] === "Pending") {
        doneButton.innerText = "Mark As In Progress";
        doneButton.addEventListener(
            'mouseup',
            async () => {
                await markComplete(sessionID, task["TaskID"], "In Progress");

                // Get the task list again
                taskList = [];
                await renderTasks();

                taskViewer.hidden = true;
                addTaskButton.hidden = false;
                taskBox.hidden = false;
            }
        );
    }
    else if (task["Status"] === "In Progress") {
        doneButton.innerText = "Mark As Completed";
        doneButton.addEventListener(
            'mouseup',
            async () => {
                await markComplete(sessionID, task["TaskID"], "Completed");

                // Get the task list again
                taskList = [];
                await renderTasks();

                taskViewer.hidden = true;
                addTaskButton.hidden = false;
                taskBox.hidden = false;
            }
        );
    }
    else {
        doneButton.innerText = "Mark As In Progress";
        doneButton.addEventListener(
            'mouseup',
            async () => {
                await markComplete(sessionID, task["TaskID"], "In Progress");

                // Get the task list again
                taskList = [];
                await renderTasks();

                taskViewer.hidden = true;
                addTaskButton.hidden = false;
                taskBox.hidden = false;
            }
        );
    }
    buttonDiv.appendChild(doneButton);
    buttonDiv.appendChild(lineBreak.cloneNode());

    // Back button
    const backButtonDiv = document.createElement('div');
    backButtonDiv.align = "center";
    const backButtonSpan = document.createElement('span');
    backButtonSpan.id = "taskViewBackButton";
    backButtonSpan.className = "brown-text";
    backButtonSpan.role = "button";
    backButtonSpan.tabIndex = 0;
    backButtonSpan.innerHTML = "<strong>Back</strong>";

    // Back button callback
    backButtonSpan.addEventListener(
        'mouseup',
        () => {
            taskViewer.hidden = true;
            addTaskButton.hidden = false;
            taskBox.hidden = false;
        }
    );

    taskViewer.appendChild(buttonDiv);
    backButtonDiv.appendChild(backButtonSpan);
    taskViewer.appendChild(backButtonDiv);

    taskViewer.hidden = false;
    addTaskButton.hidden = true;
    taskBox.hidden = true;
}

/**
 * Fetches and then renders the tasks in the main page.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function renderTasks() {
    try {
        // Text color of the overdue tasks
        const overDueTaskColor = "#c00";
        const completedTaskColor = "#0f0";
        // If the taskList is empty (or has been emptied), fetch it again
        if (taskList.length === 0) {
            taskList = await fetchTasks();
        }
        // If something failed, send the user back to the login page
        if (taskList["status"] !== "success") {
            // window.location.href = "/";
        }
        // Clear the taskBox before filling it again
        taskBox.innerHTML = '';

        // Create the table head with each column name.
        const tableHeadClass = document.createElement('thead');
        tableHeadClass.className = "thead-dark";
        const tableHead = document.createElement('tr');
        let tableHeadEntry;

        // For loop so the code isn't as WET
        for (
            const heading of [
            "Recipe Name", "Amount To Bake", "Status", "Assignment Date", "Completion By"
        ]) {
            tableHeadEntry = document.createElement('th');
            tableHeadEntry.innerText = heading;
            tableHeadEntry.style.textAlign = "center";
            tableHeadEntry.scope = "col";
            tableHead.appendChild(tableHeadEntry);
        }

        // Add the head to the table
        tableHeadClass.appendChild(tableHead);

        taskBox.appendChild(tableHeadClass);

        // Make sure that there's data to render
        if (taskList["recipes"] instanceof Array) {
            // Don't make this each time in the for loop
            const now = new Date();
            // Render rows for each task
            for (const task of taskList["recipes"]) {
                // Date of the task to check against now
                const whenDue = new Date(task["DueDate"]);
                // Make the row for this task
                const taskEntry = document.createElement('tr');
                taskEntry.id = task["TaskID"];
                taskEntry.className = "task-row";

                // Add the recipe name
                const name = document.createElement('td');
                name.innerText = task["RecipeName"];
                name.style.textAlign = "center";
                if (whenDue < now && (!("CompletionDate" in task) || task["CompletionDate"] === null)) {
                    name.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(name);

                // Add the amount to bake
                const amount = document.createElement('td');
                amount.innerText = task["AmountToBake"];
                amount.style.textAlign = "center";
                if (whenDue < now && (!("CompletionDate" in task) || task["CompletionDate"] === null)) {
                    amount.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(amount);

                // Add the status
                const status = document.createElement('td');
                status.innerText = task["Status"];
                status.style.textAlign = "center";
                if (whenDue < now && (!("CompletionDate" in task) || task["CompletionDate"] === null)) {
                    status.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(status);

                // Add the assignment date
                const assignmentDate = document.createElement('td');
                assignmentDate.innerText = task["AssignmentDate"].substring(0, 10);
                assignmentDate.style.textAlign = "center";
                if (whenDue < now && (!("CompletionDate" in task) || task["CompletionDate"] === null)) {
                    assignmentDate.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(assignmentDate);

                // Just in case the SQL query gets tampered with, check for this.
                if (!("CompletionDate" in task) || task["CompletionDate"] === null) {
                    // Add the due date
                    const dueDate = document.createElement('td');
                    dueDate.innerText = task["DueDate"].substring(0, 10);
                    dueDate.style.textAlign = "center";
                    if (whenDue < now  && (!("CompletionDate" in task) || task["CompletionDate"] === null)) {
                        dueDate.style.color = overDueTaskColor;
                    }
                    taskEntry.appendChild(dueDate);
                }
                // Eh, render "Completed" if it's here
                else {
                    const isDone = document.createElement('td');
                    isDone.innerText = "Completed";
                    isDone.style.textAlign = "center";
                    taskEntry.appendChild(isDone)
                }

                // Add faux row for spacing
                const fauxRow = document.createElement('tr');
                const fauxColumn = document.createElement('td');
                fauxRow.className = "faux-task-row";
                fauxRow.append(fauxColumn, fauxColumn.cloneNode(true), fauxColumn.cloneNode(true), fauxColumn.cloneNode(true), fauxColumn.cloneNode(true));
                taskBox.appendChild(fauxRow);

                // Make the real row clickable
                taskEntry.addEventListener(
                    'mousedown',
                    () => {
                        viewTask(task, taskViewer, taskBox, addTaskButton);
                    }
                );

                // Add the entry to the list
                taskBox.appendChild(taskEntry);
            }
            // Show the task box
            taskBox.hidden = false;
        }
    }
    catch (e) {
        console.error(e);
        // Return to home if the user is not logged in
        window.location.href = "/";
    }
}

/**
 * Add a task to the database.
 * @param RecipeID {String} The id of the recipe associated with this task.
 * @param AmountToBake {String|Number} The amount of the recipe to bake.
 * String or number, it'll work itself out around the backend or database.
 * @param DueDate {String} the ISO string of the selected due date.
 * @param AssignedEmployeeID {String} the id of the employee this task is for.
 * @param Comments {String} the *sanitized* comments on this task.
 * Basically, replace quotes with the appropriate HTML entity.
 * @returns {Promise<Response|string|string>} returns "error" if an error happened.
 */
async function addTask(RecipeID, AmountToBake, DueDate, AssignedEmployeeID, Comments) {
    if (sessionID) {
        // If there are comments, send them in the body
        if (Comments.length > 0) {
            return fetch("/api/add_task",
                {
                    method: "POST",
                    headers: {
                        session_id: sessionID,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        RecipeID: RecipeID,
                        AmountToBake: AmountToBake,
                        DueDate: DueDate,
                        AssignedEmployeeID: AssignedEmployeeID,
                        Comments: Comments
                    })
                }).then(async (response) => {
                    if (response.status < 400) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        let result = await response.json();
                        return result["reason"];
                    }
                    else {
                        console.error(await response.json());
                        return "error"
                    }
            }).catch(async (e) => {
                if (e.status === 400) {
                    let result = await e.json();
                    return result["reason"];
                }
                else {
                    console.error(e);
                    return "error";
                }
            });
        }
        // Otherwise, just yeet the other stuff at the API
        else {
            return fetch("/api/add_task",
                {
                    method: "POST",
                    headers: {
                        session_id: sessionID,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        RecipeID: RecipeID,
                        AmountToBake: AmountToBake,
                        DueDate: DueDate,
                        AssignedEmployeeID: AssignedEmployeeID
                    })
                }).then(async (response) => {
                    if (response.status < 400) {
                        return response.json();
                    }
                    else if (response.status === 400) {
                        let result = await response.json();
                        return result["reason"];
                    }
                    else {
                        console.error(await response.json());
                        return "error"
                    }
            }).catch(async (e) => {
                if (e.status === 400) {
                    let result = await e.json();
                    return result["reason"];
                }
                else {
                    console.error(e);
                    return "error";
                }
            });
        }
    }
    else {
        return "error";
    }
}

/**
 * Callback event handler for the "Add a task" button of the main page.
 * @param taskBox {HTMLElement} The taskBox to be hidden once relevant data is fetched.
 * @param addTaskButton {HTMLElement} The button this is for, but only to hide it.
 * @returns {Promise<void>} Nothing, but await if necessary.
 */
async function addTaskButtonHandler(taskBox, addTaskButton) {
    try {
        // If there are no recipes cached already, grab those
        if (recipeList.length === 0) {
            recipeList = await fetchRecipes();
        }

        // Clear the dropdown if anything was there
        recipeIDForm.innerHTML = '';
        // Boolean to mark the first recipe as selected
        let selected = true;
        // Add the recipes to the HTML form
        recipeList["recipes"].forEach((recipe) => {
            // Create the option
            const recipeOption = document.createElement('option');
            recipeOption.id = recipe["RecipeID"];
            recipeOption.innerText = recipe["RecipeName"]
            if (selected) {
                recipeOption.selected = true;
                selected = false;
            }
            // Add that option to the list of options
            recipeIDForm.appendChild(recipeOption);
        });

        // Show the form
        taskFormContainer.hidden = false;

        // Hide the rest of the interface
        taskBox.hidden = true;
        addTaskButton.hidden = true;
    }
    catch (e) {
        console.error(e);
        // Return to home if the user is not logged in
        //window.location.href = "/";
    }
}

/**
 * Callback function for submitting a new task to the API.
 * @param recipeIDForm {HTMLFormElement} The form element for the selected recipe.
 * @param amountToBake {HTMLFormElement} The form element for the amount to bake.
 * @param dueDate {HTMLFormElement} The form element for the date that the task is due.
 * @param assignedEmployeeID {HTMLFormElement} The form element for the assigned employee's id
 * @param taskNotes {HTMLTextAreaElement} The textarea element for the notes of this task.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function submitTask(recipeIDForm, amountToBake, dueDate, assignedEmployeeID, taskNotes) {
    try {
        /*
         * Little bit of validation
         */
        if (amountToBake.value < 1) {
            Swal.fire("Amount to bake must be greater than 1!");
        }
        else if (amountToBake.value > 99_999_999) {
            Swal.fire("That's way too much to bake, friend. Try a value lower than 999,999,999");
        }
        else if (!assignedEmployeeID.value.match(/\w{1,50}/)) {
            Swal.fire("That's not a valid employee id format! Check your input and try again. Employee id should be 1-50 letters or numbers");
        }
        else {
            // Send the API what the user has entered.
            let result = await addTask(
                // Grab the id of the selected option
                recipeIDForm.options[recipeIDForm.selectedIndex].id,
                // Value of the number form
                amountToBake.value,
                // Convert the HTML date value to an ISO string
                new Date(dueDate.value).toISOString(),
                // Grab the employee's id
                assignedEmployeeID.value,
                // Get the notes and replace quotes with quote entities.
                taskNotes.value.replace(/'/g, '&quot;')
            );

            // Check for an error, rendering the task page if no error was returned
            if (result === "error") {
                // Hey, user, you've done messed up
                Swal.fire("Invalid task!");
            }
            else if (result === "Invalid employee id") {
                Swal.fire("Invalid assignee!");
            }
            else if (result === "Invalid recipe id") {
                Swal.fire("Invalid recipe!");
            }
            else {
                // Get the task list again
                taskList = [];
                await renderTasks();

                // Hide the form
                taskFormContainer.hidden = true;

                // Show the rest of the interface
                taskBox.hidden = false;
                addTaskButton.hidden = false;
            }
        }
    }
    catch (e) {
        // Converting the date can throw an error, so catch that in particular
        if (e.message.startsWith("Invalid time")) {
            Swal.fire("Please enter a valid date")
        }
        // Otherwise, assume the session is invalid
        else {
            console.error(e);
            // Return to home if the user is not logged in
            //window.location.href = "/";
        }
    }
}

// Initial task rendering with a callback to make WebStorm happy.
renderTasks().then(() => {
});

// Add an event listener for the "Add a task" button to change pages
addTaskButton.addEventListener(
    'mousedown',
    () => {
        addTaskButtonHandler(taskBox, addTaskButton)
            .then(
                () => {
                }
            );
    }
);

// Add an event listener for the hidden "Submit" button for tasks
submitTaskButton.addEventListener(
    'mousedown',
    () => {
        submitTask(recipeIDForm, amountToBake, dueDate, assignedEmployeeID, taskNotes)
            .then(
                () => {
                }
            );
    }
);

/*
 * Add an event listener for the back button that shows the hidden task list.
 * This does not require refreshing the list because the user added nothing.
 */
taskFormBackButton.addEventListener(
    'mouseup',
    () => {
        // Hide the form
        taskFormContainer.hidden = true;

        // Show the rest of the interface
        taskBox.hidden = false;
        addTaskButton.hidden = false;
    }
)
