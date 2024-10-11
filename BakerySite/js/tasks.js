/**
 * Code for rendering the task interface.
 */

// User's session_id to be used
const sessionID = localStorage.getItem('session_id');

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

const submitTaskButton = document.getElementById('submitTaskButton');

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

async function renderTasks() {
    try {
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

                // Add the recipe name
                const name = document.createElement('td');
                name.innerText = task["RecipeName"];
                name.style.textAlign = "center";
                if (whenDue < now) {
                    name.style.color = "red";
                }
                taskEntry.appendChild(name);

                // Add the amount to bake
                const amount = document.createElement('td');
                amount.innerText = task["AmountToBake"];
                amount.style.textAlign = "center";
                if (whenDue < now) {
                    amount.style.color = "red";
                }
                taskEntry.appendChild(amount);

                // Add the status
                const status = document.createElement('td');
                status.innerText = task["Status"];
                status.style.textAlign = "center";
                if (whenDue < now) {
                    status.style.color = "red";
                }
                taskEntry.appendChild(status);

                // Add the assignment date
                const assignmentDate = document.createElement('td');
                assignmentDate.innerText = task["AssignmentDate"].substring(0, 10);
                assignmentDate.style.textAlign = "center";
                if (whenDue < now) {
                    assignmentDate.style.color = "red";
                }
                taskEntry.appendChild(assignmentDate);

                if (!("CompletionDate" in task)) {
                    // Add the due date
                    const dueDate = document.createElement('td');
                    dueDate.innerText = task["DueDate"].substring(0, 10);
                    dueDate.style.textAlign = "center";
                    if (whenDue < now) {
                        dueDate.style.color = "red";
                    }
                    taskEntry.appendChild(dueDate);
                }
                else {
                    const isDone = document.createElement('td');
                    isDone.innerText = "Completed";
                    isDone.style.textAlign = "center";
                    taskEntry.appendChild(isDone)
                }

                taskBox.appendChild(taskEntry);
            }
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
