const sessionID = localStorage.getItem('session_id');
const recipeFormContainer = document.getElementById('recipeFormContainer');

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
 * @param recipeName {HTMLInputElement} The recipe name form.
 * @param description {String} The description form value.
 * @param category {String} The category form (string for now)
 * @param prepTime {HTMLInputElement} The prep time form.
 * @param cookTime {HTMLInputElement} The cook time form.
 * @param servings {HTMLInputElement} The number of servings form.
 * @param instructions {String} The instruction form value.
 * @returns {Promise<String>} "success" or "error"
 */
async function addRecipe(recipeName, description, category, prepTime, cookTime, servings, instructions) {
    return fetch('api/add_recipe', {
        method: 'POST',
        headers: {
            session_id: sessionID
        },
        body: JSON.stringify({
            RecipeName: recipeName.value,
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

/**
 * Update a recipe
 * @param recipeName {HTMLInputElement} The recipe name form.
 * @param description {String} The description form value.
 * @param category {String} The category form (string for now)
 * @param prepTime {HTMLInputElement} The prep time form.
 * @param cookTime {HTMLInputElement} The cook time form.
 * @param servings {HTMLInputElement} The number of servings form.
 * @param instructions {String} The instruction form value.
 * @returns {Promise<String>} "success" or "error"
 */
async function updateRecipe(recipeName, description, category, prepTime, cookTime, servings, instructions, recipeID) {
    return fetch(`api/add_recipe/${recipeID}`, {
        method: 'PUT',
        headers: {
            session_id: sessionID
        },
        body: JSON.stringify({
            RecipeName: recipeName.value,
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

async function renderRecipeForm(recipe = null, editMode = false) {
    let ingredients = getIngredients();
    recipeFormContainer.innerHTML = '';

    // Create the heading
    const heading = document.createElement('h1');
    if (!recipe) {
        console.log('Null Recipe')
        console.log(recipe);

        heading.innerText = "Add a New Recipe";
    }
    else if (recipe && editMode) {
        console.log('Edit recipe')
        console.log(recipe);
        heading.innerText = `Edit ${recipe[0].RecipeName}`;
        document.title = `Edit ${recipe[0].RecipeName}`;
    }
    else {
        console.log('View Recipe')
        console.log(recipe);

        heading.innerText = recipe[0].RecipeName;
        document.title = recipe[0].RecipeName;
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
        recipeNameForm.innerText = recipe["RecipeName"];
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
        estimatedPrepTimeForm.innerText = recipe[0].PrepTime;
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
        console.log(recipe[0].PrepTime)
        estimatedCookTimeForm.innerText = recipe[0].CookTime;
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
        servingsForm.innerText = recipe["Servings"];
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
        descriptionInput.innerText = recipe[0].Description.replace(/&quot;/g, '\'');;
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
    recipeFormContainer.appendChild(document.createElement('br'));

    // Create the ingredient table
    const ingredientsTable = document.createElement('table');

    // Create the table head with each column name.
    const tableHeadClass = document.createElement('thead');
    tableHeadClass.className = "thead-dark";
    const tableHead = document.createElement('tr');

    // For loop so the code isn't as WET
    for (
        const heading of [
        "Amount", "Unit", "Ingredient"
    ]) {
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
    recipeFormContainer.appendChild(document.createElement('br'));

    ingredients = await ingredients;
    // TODO: Add existing ingredients
    // TODO: Add button and even listener for new ingredients

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
        instructionsForm.innerText = recipe[0].Instructions.replace(/&quot;/g, '\'');;
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
                renderRecipeForm(recipe, true);
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

                if (!recipeName.value.match(/^[\w\s.,*/]{1,50}$/)) {
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
                        recipeName,
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

                if (!recipeName.value.match(/^[\w\s.,*/]{1,50}$/)) {
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
                        recipeName,
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
        if (recipe) {
            fetch(`/api/recipe/${recipe}`, {
                method: "GET",
                headers: {
                    session_id: sessionID
                }
            }).then(async (response) => {
                if (response.status < 400) {
                    console.log('yes recipe')

                    const result = await response.json();

                    renderRecipeForm(result["recipe"]);
                }
                else {
                    renderRecipeForm();
                }
            })
        }
        else {
            console.log('No recipe')
            await renderRecipeForm()
        }
    }
    else {
        window.location.href = "/"
    }
}

const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get("recipe"));
const recipeID = urlParams.get("recipe");

getRecipe(recipeID).then(() => {});
