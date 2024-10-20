const sessionID = localStorage.getItem('session_id');
const recipeFormContainer = document.getElementById('recipeFormContainer');
const unitsOfMeasure = ['g', 'kg', 'ml', 'l', 'oz', 'cups', 'lbs'];

/**
 * Get a list of ingredients from the API.
 * @returns {Promise<*|string>}
 */
async function getIngredients() {
    return await fetch('api/ingredients_short',{
        method: 'GET',
        headers: {
            session_id: sessionID
        }
    }).then(async (result) => {
        if (result.status === 200) {
            const result_json = await result.json();
            return result_json["content"];
        }
        else {
            return "error";
        }
    }).catch((e) => {
        console.error(e);
        return "error"
    });
}

/**
 * Submit a recipe to the API
 * @param recipeName {String} The recipe name form.
 * @param description {String} The description form value.
 * @param category {String} The category form (string for now)
 * @param prepTime {HTMLInputElement} The prep time form.
 * @param cookTime {HTMLInputElement} The cook time form.
 * @param servings {HTMLInputElement} The number of servings form.
 * @param instructions {String} The instruction form value.
 * @returns {Promise<String>} Recipe id or "error"
 */
async function addRecipe(recipeName, description, category, prepTime, cookTime, servings, instructions) {
    return fetch('api/add_recipe', {
        method: 'POST',
        headers: {
            session_id: sessionID,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            RecipeName: recipeName,
            Description: description,
            Category: category,     // TODO: Make this category.options[category.selectedIndex].value
            PrepTime: prepTime.value,
            CookTime: cookTime.value,
            Servings: servings.value,
            Instructions: instructions,
        })
    }).then(async (result) => {
        if (result.status === 201 || result.status === 200) {
            const result_json = await result.json();
            return result_json["recipeID"];
        }
        else {
            console.error(await result.json());
            return "error";
        }
    }).catch((e) => {
        console.error(e);
        return "error";
    });
}

async function addRecipeIngredient(recipeID, inventoryID, quantity, unitOfMeasure) {
    return fetch('api/add_recipe_ingredient_full', {
        method: 'POST',
        headers: {
            session_id: sessionID,
            recipe_id: recipeID,
            inventory_id: inventoryID,
            quantity: quantity,
            unit_of_measure: unitOfMeasure
        }
    }).then(async (response) => {
        if (response.status === 201 || response.status === 200) {
            return "success";
        }
        else {
            console.error(await response.json());
            return "error";
        }
    }).catch((e) => {
        console.error(e);
        return "error";
    })
}

/**
 * Update a recipe
 * @param recipeName {String} The recipe name form.
 * @param description {String} The description form value.
 * @param category {String} The category form (string for now)
 * @param prepTime {HTMLInputElement} The prep time form.
 * @param cookTime {HTMLInputElement} The cook time form.
 * @param servings {HTMLInputElement} The number of servings form.
 * @param instructions {String} The instruction form value.
 * @param recipeID {String} The recipe to update's id.
 * @returns {Promise<String>} "success" or "error"
 */
async function updateRecipe(recipeName, description, category, prepTime, cookTime, servings, instructions, recipeID) {
    return fetch(`api/update_recipe/${recipeID}`, {
        method: 'PUT',
        headers: {
            session_id: sessionID,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            RecipeName: recipeName,
            Description: description,
            Category: category,     // TODO: Make this category.options[category.selectedIndex].value
            PrepTime: prepTime.value,
            CookTime: cookTime.value,
            Servings: servings.value,
            Instructions: instructions,
        }),
    }).then(async (result) => {
        if (result.status === 201 || result.status === 200) {
            return "success";
        }
        else {
            console.error(await result.json())
            return "error"
        }
    }).catch((e) => {
        console.error(e);
        return "error";
    })
}

async function renderRecipeForm(recipe = null, editMode = false, ingredients = undefined) {
    recipeFormContainer.innerHTML = '';

    // Create the heading
    const heading = document.createElement('h1');
    if (!recipe) {
        heading.innerText = "Add a New Recipe";
    }
    else if (recipe && editMode) {
        heading.innerText = `Edit ${recipe["RecipeName"].replace(/&quot;/g, '\'')}`;
        document.title = `Edit ${recipe["RecipeName"].replace(/&quot;/g, '\'')}`;
    }
    else {
        heading.innerText = recipe["RecipeName"].replace(/&quot;/g, '\'');
        document.title = recipe["RecipeName"].replace(/&quot;/g, '\'');
    }
    recipeFormContainer.appendChild(heading);

    // Create the name label
    const recipeNameLabel = document.createElement("label");
    recipeNameLabel.htmlFor = "recipeName";
    recipeNameLabel.className = "control-label";
    recipeNameLabel.innerText = "Recipe Name";
    recipeFormContainer.appendChild(recipeNameLabel);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Create the name form
    const recipeNameForm = document.createElement('input');
    recipeNameForm.id = "recipeName";
    recipeNameForm.name = "Recipe Name";
    recipeNameForm.className = "form-control";
    recipeNameForm.required = true;
    recipeNameForm.ariaRequired = "true";
    if (recipe) {
        recipeNameForm.value = recipe["RecipeName"].replace(/&quot;/g, '\'');
    }
    else {
        recipeNameForm.placeholder = "Recipe Name...";
    }
    if (!editMode && recipe) {
        recipeNameForm.readOnly = true;
    }
    recipeFormContainer.appendChild(recipeNameForm);
    recipeFormContainer.appendChild(document.createElement('br'));

    // TODO: Category form

    // Estimated prep time label
    const estimatedPrepTimeLabel = document.createElement("label");
    estimatedPrepTimeLabel.htmlFor = "estimatedPrepTime";
    estimatedPrepTimeLabel.className = "control-label";
    estimatedPrepTimeLabel.innerText = "Estimated Prep Time (minutes)";
    recipeFormContainer.appendChild(estimatedPrepTimeLabel);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Estimated prep time form
    const estimatedPrepTimeForm = document.createElement('input');
    estimatedPrepTimeForm.id = "estimatedPrepTime";
    estimatedPrepTimeForm.name = "Estimated Prep Time";
    estimatedPrepTimeForm.className = "form-control";
    estimatedPrepTimeForm.type = "number";
    estimatedPrepTimeForm.max = `${2 ** 31 - 1}`;
    estimatedPrepTimeForm.min = "1";
    estimatedPrepTimeForm.step = "5";
    estimatedPrepTimeForm.required = true;
    estimatedPrepTimeForm.ariaRequired = "true";
    if (recipe) {
        estimatedPrepTimeForm.value = recipe["PrepTime"];
    }
    else {
        estimatedPrepTimeForm.placeholder = "0";
    }
    if (!editMode && recipe) {
        estimatedPrepTimeForm.readOnly = true;
    }
    recipeFormContainer.appendChild(estimatedPrepTimeForm);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Estimated cook time label
    const estimatedCookTimeLabel = document.createElement("label");
    estimatedCookTimeLabel.htmlFor = "estimatedCookTime";
    estimatedCookTimeLabel.className = "control-label";
    estimatedCookTimeLabel.innerText = "Estimated Cook Time (minutes)";
    recipeFormContainer.appendChild(estimatedCookTimeLabel);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Estimated cook time form
    const estimatedCookTimeForm = document.createElement('input');
    estimatedCookTimeForm.id = "estimatedCookTime";
    estimatedCookTimeForm.name = "Estimated Cook Time";
    estimatedCookTimeForm.className = "form-control";
    estimatedCookTimeForm.type = "number";
    estimatedCookTimeForm.max = `${2 ** 31 - 1}`;
    estimatedCookTimeForm.min = "1";
    estimatedPrepTimeForm.step = "5";
    estimatedCookTimeForm.required = true;
    estimatedCookTimeForm.ariaRequired = "true";
    if (recipe) {
        estimatedCookTimeForm.value = recipe["CookTime"];
    }
    else {
        estimatedCookTimeForm.placeholder = "0";
    }
    if (!editMode && recipe) {
        estimatedCookTimeForm.readOnly = true;
    }
    recipeFormContainer.appendChild(estimatedCookTimeForm);
    recipeFormContainer.appendChild(document.createElement('br'));

    // TODO: Scale when recipe and not edit mode

    // Number of servings label
    const numServingsLabel = document.createElement("label");
    numServingsLabel.htmlFor = "numServingsForm";
    numServingsLabel.className = "control-label";
    numServingsLabel.innerText = "Servings";
    recipeFormContainer.appendChild(numServingsLabel);
    recipeFormContainer.appendChild(document.createElement('br'));

    // The serving amount form
    const servingsForm = document.createElement("input");
    servingsForm.id = "numServingsForm";
    servingsForm.className = "form-control";
    servingsForm.type = "number";
    servingsForm.min = "1";
    servingsForm.max = `${2 ** 31 - 1}`;
    servingsForm.required = true;
    servingsForm.ariaRequired = "true";
    if (recipe) {
        servingsForm.value = recipe["Servings"];
    }
    else {
        servingsForm.placeholder = "0";
    }
    if (!editMode && recipe) {
        servingsForm.readOnly = true;
    }
    recipeFormContainer.appendChild(servingsForm);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Description label
    const descriptionLabel = document.createElement("label");
    descriptionLabel.htmlFor = "descriptionInput";
    descriptionLabel.className = "control-label";
    descriptionLabel.innerText = "Description";
    recipeFormContainer.appendChild(descriptionLabel);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Description input
    const descriptionInput = document.createElement("input");
    descriptionInput.id = "descriptionInput";
    descriptionInput.type = "text";
    descriptionInput.maxLength = 2 ** 31 - 1;
    descriptionInput.minLength = 0;
    descriptionInput.className = "form-control";
    descriptionInput.required = true;
    descriptionInput.ariaRequired = "true";
    if (recipe) {
        descriptionInput.value = recipe["Description"].replace(/&quot;/g, '\'');
    }
    else {
        descriptionInput.placeholder = "Recipe description...";
    }
    if (!editMode && recipe) {
        descriptionInput.readOnly = true;
    }
    recipeFormContainer.appendChild(descriptionInput);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Ingredients label
    const ingredientsLabel = document.createElement("p");
    ingredientsLabel.innerText = "Ingredients";
    ingredientsLabel.className = "control-label";
    recipeFormContainer.appendChild(ingredientsLabel);

    // Create the ingredient table
    const ingredientsTable = document.createElement('table');
    ingredientsTable.className = "table";
    ingredientsTable.style.backgroundColor = "#ffffffd1"
    ingredientsTable.id = "ingredientsTable";

    // Create the table head with each column name.
    const tableHeadClass = document.createElement('thead');
    tableHeadClass.className = "thead-dark";
    const tableHead = document.createElement('tr');

    // For loop so the code isn't as WET
    let headings;
    if (editMode || !recipe) {
        headings = ["Ingredient", "Amount", "Unit", " "];
    }
    else {
        headings = ["Ingredient", "Amount", "Unit"];
    }
    for (const heading of headings) {
        const tableHeadEntry = document.createElement('th');
        tableHeadEntry.innerText = heading;
        tableHeadEntry.style.textAlign = "center";
        tableHeadEntry.scope = "col";
        tableHead.appendChild(tableHeadEntry);
    }

    // Add the head to the table
    tableHeadClass.appendChild(tableHead);
    ingredientsTable.appendChild(tableHeadClass);
    recipeFormContainer.appendChild(ingredientsTable);

    if (recipe && recipe["recipeIngredients"].length > 0) {
        for (const recipeIngredient of recipe["recipeIngredients"]) {
            const ingredientsTableElement = document.getElementById("ingredientsTable");
            const ingredientRow = document.createElement("tr");
            ingredientRow.className = "task-row";
            ingredientRow.id = recipeIngredient["ingredientId"];

            // Ingredient dropdown
            const ingredientSelect = document.createElement("select");
            ingredientSelect.className = "form-control";
            ingredientSelect.name = "Ingredient selection";
            ingredientSelect.title = "Ingredient selection";
            ingredientSelect.required = true;
            ingredientSelect.ariaRequired = "true";
            if (!editMode) {
                ingredientSelect.disabled = true;
            }
            for (const ingredient of ingredients) {
                const ingredientOption = document.createElement('option');
                ingredientOption.id = ingredient["InventoryID"];
                ingredientOption.innerText = ingredient["Name"];
                if (ingredient["Name"] === recipeIngredient["inventoryName"]) {
                    ingredientOption.selected = true;
                }
                ingredientSelect.appendChild(ingredientOption);
            }
            const ingredientColumn = document.createElement('td');
            ingredientColumn.style.alignItems = "center";
            ingredientColumn.appendChild(ingredientSelect);
            ingredientRow.appendChild(ingredientColumn);

            // Amount form
            const amountForm = document.createElement("input");
            amountForm.type = "number";
            amountForm.className = "form-control";
            amountForm.max = "999999999"
            amountForm.min = "1"
            amountForm.required = true;
            amountForm.ariaRequired = "true";
            amountForm.title = "Ingredient Amount";
            amountForm.value = recipeIngredient["quantity"];
            const amountColumn = document.createElement('td');
            amountColumn.style.alignItems = "center";
            if (!editMode) {
                amountForm.readOnly = true;
            }
            amountColumn.appendChild(amountForm);
            ingredientRow.appendChild(amountColumn);

            // Unit input form
            const unitOfMeasureForm = document.createElement('select');
            unitOfMeasureForm.className = "form-control";
            unitOfMeasureForm.name = "reorderUnit";
            unitOfMeasureForm.title = "Reorder Unit";
            unitOfMeasureForm.required = true;
            unitOfMeasureForm.ariaRequired = "true";
            if (!editMode) {
                unitOfMeasureForm.disabled = true;
            }

            for (const unit of unitsOfMeasure) {
                const unitElement = document.createElement('option');
                unitElement.innerText = unit;
                if (unit === recipeIngredient["unit"]) {
                    unitElement.selected = true;
                }
                unitOfMeasureForm.appendChild(unitElement);
            }
            const unitColumn = document.createElement('td');
            unitColumn.style.alignItems = "center";
            unitColumn.appendChild(unitOfMeasureForm);
            ingredientRow.appendChild(unitColumn);

            if (editMode) {
                const trashButtonColumn = document.createElement('td');
                const trashButton = document.createElement('button');
                trashButton.innerText = "🗑️";
                trashButton.type = "button";
                trashButton.id = "submitItemButton";
                trashButton.className = "btn btn-primary col-12";
                trashButton.style.opacity = "0.5";
                trashButton.addEventListener(
                    'mousedown',
                    () => {
                        alert("Cannot remove ingredient!");
                    }
                );
                trashButtonColumn.appendChild(trashButton);
                ingredientRow.appendChild(trashButtonColumn);
            }

            // Add the row
            ingredientsTableElement.appendChild(ingredientRow);
        }
    }

    // TODO: Add button and event listener for new ingredients
    if (editMode || !recipe) {
        // Div for the add button
        const addButtonDiv = document.createElement("div");
        addButtonDiv.id = "addButtonDiv";
        addButtonDiv.align = "center";

        // Add ingredient button
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.id = "addButton";
        addButton.className = "btn btn-primary col-12";
        addButton.innerText = "+";

        let numIngredients = 0;

        // Add ingredient event listener
        addButton.addEventListener(
            'mousedown',
            () => {
                const ingredientsTableElement = document.getElementById("ingredientsTable");
                const ingredientRow = document.createElement("tr");
                ingredientRow.className = "task-row";
                ingredientRow.id = `ingredient-${numIngredients}`;

                // Ingredient dropdown
                const ingredientSelect = document.createElement("select");
                ingredientSelect.className = "form-control";
                ingredientSelect.name = "Ingredient selection";
                ingredientSelect.title = "Ingredient selection";
                ingredientSelect.required = true;
                ingredientSelect.ariaRequired = "true";
                for (const ingredient of ingredients) {
                    const ingredientOption = document.createElement('option');
                    ingredientOption.id = ingredient["InventoryID"];
                    ingredientOption.innerText = ingredient["Name"];
                    ingredientSelect.appendChild(ingredientOption);
                }
                const ingredientColumn = document.createElement('td');
                ingredientColumn.style.alignItems = "center";
                ingredientColumn.appendChild(ingredientSelect);
                ingredientRow.appendChild(ingredientColumn);

                // Amount form
                const amountForm = document.createElement("input");
                amountForm.type = "number";
                amountForm.className = "form-control";
                amountForm.max = "999999999"
                amountForm.min = "1"
                amountForm.required = true;
                amountForm.ariaRequired = "true";
                amountForm.title = "Ingredient Amount";
                const amountColumn = document.createElement('td');
                amountColumn.style.alignItems = "center";
                amountColumn.appendChild(amountForm);
                ingredientRow.appendChild(amountColumn);

                // Unit input form
                const unitOfMeasureForm = document.createElement('select');
                unitOfMeasureForm.className = "form-control";
                unitOfMeasureForm.name = "reorderUnit";
                unitOfMeasureForm.title = "Reorder Unit";
                unitOfMeasureForm.required = true;
                unitOfMeasureForm.ariaRequired = "true";

                for (const unit of unitsOfMeasure) {
                    const unitElement = document.createElement('option');
                    unitElement.innerText = unit;
                    unitOfMeasureForm.appendChild(unitElement);
                }
                const unitColumn = document.createElement('td');
                unitColumn.style.alignItems = "center";
                unitColumn.appendChild(unitOfMeasureForm);
                ingredientRow.appendChild(unitColumn);

                const trashButtonColumn = document.createElement('td');
                const trashButton = document.createElement('button');
                trashButton.innerText = "🗑️";
                trashButton.type = "button";
                trashButton.id = "submitItemButton";
                trashButton.className = "btn btn-primary col-12";
                const thisIngredient = `ingredient-${numIngredients}`;
                trashButton.addEventListener(
                    'mousedown',
                    () => {
                        document.getElementById(thisIngredient).remove();
                    }
                );
                trashButtonColumn.appendChild(trashButton);
                ingredientRow.appendChild(trashButtonColumn);

                ingredientsTableElement.appendChild(ingredientRow);
                numIngredients++;
            }
        )

        addButtonDiv.appendChild(addButton);
        recipeFormContainer.appendChild(addButtonDiv);
        recipeFormContainer.appendChild(document.createElement('br'));
    }

    // Instruction label
    const instructionsLabel = document.createElement("label");
    instructionsLabel.htmlFor = "instructionsInput";
    instructionsLabel.className = "control-label";
    instructionsLabel.innerText = "Instructions";
    recipeFormContainer.appendChild(instructionsLabel);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Instruction input
    const instructionsForm = document.createElement("textarea");
    instructionsForm.id = "instructionsInput";
    instructionsForm.type = "text";
    instructionsForm.maxLength = 2 ** 31 - 1;
    instructionsForm.minLength = 0;
    instructionsForm.className = "form-control";
    instructionsForm.required = true;
    instructionsForm.ariaRequired = "true";
    if (recipe) {
        instructionsForm.innerText = recipe["Instructions"].replace(/&quot;/g, '\'');
    }
    else {
        instructionsForm.placeholder = "Recipe instructions...";
    }
    if (!editMode && recipe) {
        instructionsForm.readOnly = true;
    }
    recipeFormContainer.appendChild(instructionsForm);
    recipeFormContainer.appendChild(document.createElement('br'));

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = "button";
    submitButton.id = "submitRecipeButton";
    submitButton.className = "form-control btn btn-primary col-12 mt-4";
    submitButton.style.width = "50%";
    submitButton.style.marginBottom = "1em";

    if (recipe && !editMode) {
        submitButton.innerText = "Edit";
        submitButton.addEventListener(
            'mousedown',
            () => {
                renderRecipeForm(recipe, true, ingredients);
            }
        )
    }
    else if (recipe) {
        submitButton.innerText = "Update";
        submitButton.addEventListener(
            'mousedown',
            async () => {
                const recipeName = document.getElementById("recipeName");
                const estimatedPrepTime = document.getElementById("estimatedPrepTime");
                const estimatedCookTime = document.getElementById("estimatedCookTime");
                const numServingsForm = document.getElementById("numServingsForm");
                const descriptionInputForm = document.getElementById("descriptionInput");
                const instructionsInput = document.getElementById("instructionsInput");
                const ingredientsTableElement = document.getElementById("ingredientsTable");

                if (!recipeName.value.match(/^[\w\s'"!;:\-.,*/]{1,50}$/)) {
                    Swal.fire("Invalid name format!");
                }
                else if (estimatedPrepTime.value < 0) {
                    Swal.fire("Prep time cannot be negative!");
                }
                else if (estimatedPrepTime.value > 99_999_999) {
                    Swal.fire("Prep time too large!");
                }
                else if (estimatedCookTime.value < 0) {
                    Swal.fire("Cook time cannot be negative!");
                }
                else if (estimatedCookTime.value > 99_999_999) {
                    Swal.fire("Cook time too large!");
                }
                else if (numServingsForm.value < 0) {
                    Swal.fire("Servings cannot be negative!");
                }
                else if (numServingsForm.value > 99_999_999) {
                    Swal.fire("Number of servings too large!");
                }
                else {
                    let result = await updateRecipe(
                        recipeName.value.replace(/'/g, '&quot;'),
                        descriptionInputForm.value.replace(/'/g, '&quot;'),
                        "Sweets",
                        estimatedPrepTime,
                        estimatedCookTime,
                        servingsForm,
                        instructionsInput.value.replace(/'/g, '&quot;'),
                        recipe["RecipeID"]
                    );
                    if (result === "error") {
                        Swal.fire("Invalid recipe!");
                    }
                    else {
                        let rows = ingredientsTableElement.querySelectorAll('tr');
                        if (rows.length > 1) {
                            for (const row of rows) {
                                if (row.className !== '' && row.id.startsWith("ingredient")) {
                                    const columns = row.getElementsByTagName('td');
                                    const ingredient = columns[0].querySelector('select');
                                    const amount = columns[1].querySelector('input');
                                    const unit = columns[2].querySelector('select');
                                    await addRecipeIngredient(
                                        recipe["RecipeID"],
                                        ingredient.options[ingredient.selectedIndex].id,
                                        amount.value,
                                        unit.options[unit.selectedIndex].value,
                                    );
                                }
                            }
                        }
                        await getRecipe(recipe["RecipeID"]);
                    }
                }
            }
        )
    }
    else {
        submitButton.innerText = "Submit";
        submitButton.addEventListener(
            'mousedown',
            async () => {
                const recipeName = document.getElementById("recipeName");
                const estimatedPrepTime = document.getElementById("estimatedPrepTime");
                const estimatedCookTime = document.getElementById("estimatedCookTime");
                const numServingsForm = document.getElementById("numServingsForm");
                const descriptionInputForm = document.getElementById("descriptionInput");
                const instructionsInput = document.getElementById("instructionsInput");
                const ingredientsTableElement = document.getElementById("ingredientsTable");

                if (!recipeName.value.match(/^[\w\s'"!;:\-.,*/]{1,50}$/)) {
                    Swal.fire("Invalid name format!");
                }
                else if (estimatedPrepTime.value < 0) {
                    Swal.fire("Prep time cannot be negative!");
                }
                else if (estimatedPrepTime.value > 99_999_999) {
                    Swal.fire("Prep time too large!");
                }
                else if (estimatedCookTime.value < 0) {
                    Swal.fire("Cook time cannot be negative!");
                }
                else if (estimatedCookTime.value > 99_999_999) {
                    Swal.fire("Cook time too large!");
                }
                else if (numServingsForm.value < 0) {
                    Swal.fire("Servings cannot be negative!");
                }
                else if (numServingsForm.value > 99_999_999) {
                    Swal.fire("Number of servings too large!");
                }
                else {
                    let result = await addRecipe(
                        recipeName.value.replace(/'/g, '&quot;'),
                        descriptionInputForm.value.replace(/'/g, '&quot;'),
                        "Sweets",
                        estimatedPrepTime,
                        estimatedCookTime,
                        servingsForm,
                        instructionsInput.value.replace(/'/g, '&quot;')
                    );
                    if (result === "error") {
                        Swal.fire("Invalid recipe!");
                    }
                    else {
                        let rows = ingredientsTableElement.querySelectorAll('tr');
                        if (rows.length > 1) {
                            for (const row of rows) {
                                if (row.className !== '') {
                                    const columns = row.getElementsByTagName('td');
                                    const ingredient = columns[0].querySelector('select');
                                    const amount = columns[1].querySelector('input');
                                    const unit = columns[2].querySelector('select');
                                    await addRecipeIngredient(
                                        result,
                                        ingredient.options[ingredient.selectedIndex].id,
                                        amount.value,
                                        unit.options[unit.selectedIndex].value,
                                    );
                                }
                            }
                        }
                        history.pushState(null, "", `/recipe_view?recipe=${result}`);
                        await getRecipe(result);
                    }
                }
            }
        );
    }

    const submitButtonDiv = document.createElement("div");
    submitButtonDiv.id = "submitButtonDiv";
    submitButtonDiv.align = "center";
    submitButtonDiv.appendChild(submitButton);
    recipeFormContainer.appendChild(submitButtonDiv);
}

async function getRecipe(recipe) {
    if (sessionID) {
        let ingredients = getIngredients();
        if (recipe) {
            let recipeFetch = await fetch(`/api/recipe/${recipe}`, {
                method: "GET",
                headers: {
                    session_id: sessionID
                }
            }).then(async (response) => {
                if (response.status < 400) {
                    const result = await response.json();
                    return result["recipe"].length > 0 ? result["recipe"][0] : "error";
                }
                else {
                    return "error";
                }
            });
            let ingredientFetch = await fetch(`/api/recipe/${recipe}/ingredients`, {
                method: "GET",
                headers: {
                    session_id: sessionID
                }
            }).then(async (response) => {
                if (response.status < 400) {
                    const result = await response.json();
                    return result["ingredients"];
                }
                else {
                    return [];
                }
            });
            ingredients = await ingredients;

            if (recipeFetch === "error") {
                await renderRecipeForm(undefined, true, ingredients);
            }
            else {
                await renderRecipeForm({...recipeFetch, recipeIngredients: ingredientFetch}, false, ingredients);
            }
        }
        else {
            await renderRecipeForm(undefined, true, await ingredients);
        }
    }
    else {
        window.location.href = "/"
    }
}

const urlParams = new URLSearchParams(window.location.search);
const recipeID = urlParams.get("recipe");

getRecipe(recipeID).then(() => {});
