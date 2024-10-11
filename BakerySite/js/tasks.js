/**
 * Code for rendering the task interface.
 */

// User's session_id to be used
const sessionID = localStorage.getItem('session_id');

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

// Button to send the task to the backend
const submitTaskButton = document.getElementById('submitTaskButton');

// Back button to return to the task view
const taskFormBackButton = document.getElementById('taskFormBackButton');

/*
 * Task viewer
 */

const taskViewer = document.getElementById('taskViewer');

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

async function viewTask(task, taskViewer, taskBox, addTaskButton) {
    // Clear any previous contents of the task viewer
    taskViewer.innerHTML = '';
    const lineBreak = document.createElement("br");

    // Make the title
    const titleElement = document.createElement('h1');
    titleElement.innerText = `Make: ${task["RecipeName"]}`;
    taskViewer.appendChild(titleElement);

    // Make the recipe element
    // TODO: Make this clickable and redirect to the appropriate recipe page
    const recipeLabel = document.createElement('label');
    recipeLabel.htmlFor = "recipeClick";
    recipeLabel.className = "control-label";
    recipeLabel.innerText = "Recipe";
    taskViewer.appendChild(recipeLabel);

    const recipeRedirectButton = document.createElement('button');
    recipeRedirectButton.innerText = "Go to recipe";
    recipeRedirectButton.type = "button";
    recipeRedirectButton.className = "form-control";
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
    taskNotes.maxLength = 255;
    taskNotes.minLength = 0;
    taskNotes.className = "form-control";
    // TODO: Fetch this
    // taskNotes.value = task[""];
    taskNotes.placeholder = "TODO: Fetch this...";
    taskViewer.appendChild(taskNotes);
    taskViewer.appendChild(lineBreak.cloneNode());

    // Div for buttons
    const buttonDiv = document.createElement('div');
    buttonDiv.align = "center";
    buttonDiv.style.display = "flex";
    buttonDiv.style.alignItems = "flex-end";
    buttonDiv.style.flexDirection = "row";
    buttonDiv.style.justifyContent = "space-evenly";

    // Update task button
    const updateButton = document.createElement('button');
    updateButton.type = "button";
    updateButton.className = "form-control btn btn-primary col-12 mt-4";
    updateButton.style.width = "40%";
    updateButton.style.marginBottom = "1em";
    updateButton.id = "updateTaskButton";
    updateButton.innerText = "Update Task";
    buttonDiv.appendChild(updateButton);
    // TODO: Add event listener for update button

    // Mark task done button
    const doneButton = document.createElement('button');
    doneButton.type = "button";
    doneButton.className = "form-control btn btn-primary col-12 mt-4";
    doneButton.style.width = "40%";
    doneButton.style.marginBottom = "1em";
    doneButton.id = "updateTaskButton";
    doneButton.innerText = "Mark As Done"
    buttonDiv.appendChild(doneButton);
    buttonDiv.appendChild(lineBreak.cloneNode());
    // TODO: Add event listener for done button

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

async function renderTasks() {
    try {
        const overDueTaskColor = "#c00";
        if (taskList.length === 0) {
            taskList = await fetchTasks();
        }
        if (taskList["status"] !== "success") {
            // window.location.href = "/";
        }
        taskBox.innerHTML = '';

        const tableHeadClass = document.createElement('thead');
        tableHeadClass.className = "thead-dark";
        const tableHead = document.createElement('tr');
        let tableHeadEntry;

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

        tableHeadClass.appendChild(tableHead);

        taskBox.appendChild(tableHeadClass);

        if (taskList["recipes"] instanceof Array) {

            for (const task of taskList["recipes"]) {
                const now = new Date();
                const whenDue = new Date(task["DueDate"]);
                const taskEntry = document.createElement('tr');
                taskEntry.id = task["TaskID"];
                taskEntry.className = "task-row";

                // Add the recipe name
                const name = document.createElement('td');
                name.innerText = task["RecipeName"];
                name.style.textAlign = "center";
                if (whenDue < now) {
                    name.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(name);

                // Add the amount to bake
                const amount = document.createElement('td');
                amount.innerText = task["AmountToBake"];
                amount.style.textAlign = "center";
                if (whenDue < now) {
                    amount.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(amount);

                // Add the status
                const status = document.createElement('td');
                status.innerText = task["Status"];
                status.style.textAlign = "center";
                if (whenDue < now) {
                    status.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(status);

                // Add the assignment date
                const assignmentDate = document.createElement('td');
                assignmentDate.innerText = task["AssignmentDate"].substring(0, 10);
                assignmentDate.style.textAlign = "center";
                if (whenDue < now) {
                    assignmentDate.style.color = overDueTaskColor;
                }
                taskEntry.appendChild(assignmentDate);

                if (!("CompletionDate" in task)) {
                    // Add the due date
                    const dueDate = document.createElement('td');
                    dueDate.innerText = task["DueDate"].substring(0, 10);
                    dueDate.style.textAlign = "center";
                    if (whenDue < now) {
                        dueDate.style.color = overDueTaskColor;
                    }
                    taskEntry.appendChild(dueDate);
                }
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

                taskBox.appendChild(taskEntry);
            }
            taskBox.hidden = false;
        }
    }
    catch (e) {
        console.error(e);
        // Return to home if the user is not logged in
        window.location.href = "/";
    }
}

async function addTask(RecipeID, AmountToBake, DueDate, AssignedEmployeeID) {
    if (sessionID) {
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
            }).then((response) => {
                if (response.status < 400) {
                    return response.json();
                }
                else {
                    return "error"
                }
        }).catch((e) => {
            console.error(e);
            return "error";
        });
    }
    else {
        return "error";
    }
}

async function addTaskButtonHandler(taskBox, addTaskButton) {
    try {
        if (recipeList.length === 0) {
            recipeList = await fetchRecipes();
        }

        // Clear the dropdown if anything was there
        recipeIDForm.innerHTML = '';
        let selected = true;
        recipeList["recipes"].forEach((recipe) => {
            const recipeOption = document.createElement('option');
            recipeOption.id = recipe["RecipeID"];
            recipeOption.innerText = recipe["RecipeName"]
            if (selected) {
                recipeOption.selected = true;
                selected = false;
            }
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

async function submitTask(recipeIDForm, amountToBake, dueDate, assignedEmployeeID) {
    try {
        if (amountToBake.value < 1) {
            Swal.fire("Amount to bake must be greater than 1!");
        }
        else if (amountToBake.value > 999_999_999) {
            Swal.fire("That's way too much to bake, friend. Try a value lower than 999,999,999");
        }
        else if (!assignedEmployeeID.value.match(/\w{1,50}/)) {
            Swal.fire("That's not a valid employee id format! Check your input and try again. Employee id should be 1-50 letters or numbers");
        }
        else {
            let result = await addTask(
                recipeIDForm.options[recipeIDForm.selectedIndex].id,
                amountToBake.value,
                new Date(dueDate.value).toISOString(),
                assignedEmployeeID.value
            );

            if (result !== "error") {
                // Get the task list again
                taskList = [];
                await renderTasks();

                // Hide the form
                taskFormContainer.hidden = true;

                // Show the rest of the interface
                taskBox.hidden = false;
                addTaskButton.hidden = false;
            }
            else {
                Swal.fire("Invalid task!");
            }
        }
    }
    catch (e) {
        if (e.message.startsWith("Invalid time")) {
            Swal.fire("Please enter a valid date")
        }
        else {
            console.error(e);
            // Return to home if the user is not logged in
            //window.location.href = "/";
        }
    }
}

renderTasks().then(() => {
});

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
submitTaskButton.addEventListener(
    'mousedown',
    () => {
        submitTask(recipeIDForm, amountToBake, dueDate, assignedEmployeeID)
            .then(
                () => {
                }
            );
    }
);

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
