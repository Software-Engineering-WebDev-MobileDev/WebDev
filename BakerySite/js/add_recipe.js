const sessionID = localStorage.getItem('session_id');
const recipeForm = document.getElementById("recipeFormContainer");
const unitsOfMeasure = ['g', 'kg', 'ml', 'l', 'oz', 'cups', 'lbs', 'each'];
let ingredientsList = [];

/**
 * Fetch available ingredients from the inventory.
 * @returns {Promise<void>} Nothing
 */
async function fetchIngredients() {
    try {
        const response = await fetch('/api/inventory', {
            method: 'GET',
            headers: { session_id: sessionID }
        });
        const data = await response.json();
        ingredientsList = data.content || [];
        console.log(response)
        console.log(data)
        console.log(ingredientsList)
    } catch (e) {
        console.error('Error fetching ingredients:', e);
    }
}

/**
 * Add a recipe.
 * @param recipeNameForm {HTMLInputElement} The form with the recipe name.
 * @param descriptionForm {HTMLInputElement} The input element for the description.
 * @param categoryForm {HTMLInputElement} The input element for the category.
 * @param prepTimeForm {HTMLInputElement} The input element for the prep time.
 * @param cookTimeForm {HTMLInputElement} The input element for the cook time.
 * @param servingsForm {HTMLInputElement} The input element for the number of servings.
 * @param instructionsForm {HTMLInputElement} The textarea with instructions.
 * @param ingredients {Array} Array of ingredient objects (with id, quantity, unit).
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function addRecipe(recipeNameForm, descriptionForm, categoryForm, prepTimeForm, cookTimeForm, servingsForm, instructionsForm, ingredients) {
    await fetch('/api/add_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            session_id: sessionID
        },
        body: JSON.stringify({
            RecipeName: recipeNameForm.value,
            Description: descriptionForm.value,
            Category: categoryForm.value,
            PrepTime: prepTimeForm.value,
            CookTime: cookTimeForm.value,
            Servings: servingsForm.value,
            Instructions: instructionsForm.value,
            Ingredients: ingredients
        })
    }).then(async (response) => {
        if (response.status === 201) {
            console.log("Recipe added successfully");
            window.location.href = '/recipes.html';
        } else {
            console.error(await response.json());
            Swal.fire("Invalid recipe");
        }
    }).catch((e) => {
        console.error(e);
        Swal.fire("An error occurred while adding the recipe");
    });
}

/**
 * Add a row for selecting ingredients, quantity, and units of measure.
 */
function addIngredientRow() {
    const ingredientRow = document.createElement('div');
    ingredientRow.className = 'row mb-3 ingredientRow';

    const selectElement = document.createElement('select');
    selectElement.className = 'form-control ingredientSelect';
    selectElement.required = true;

    ingredientsList.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.IngredientID;
        option.text = ingredient.Name;
        selectElement.appendChild(option);
    });

    const quantityInput = document.createElement('input');
    quantityInput.className = 'form-control ingredientQuantity';
    quantityInput.type = 'number';
    quantityInput.placeholder = 'Quantity';
    quantityInput.required = true;

    const unitSelect = document.createElement('select');
    unitSelect.className = 'form-control ingredientUnit';
    unitsOfMeasure.forEach(unit => {
        const unitOption = document.createElement('option');
        unitOption.value = unit;
        unitOption.text = unit;
        unitSelect.appendChild(unitOption);
    });

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-danger';
    removeButton.innerText = 'Remove';
    removeButton.addEventListener('click', () => ingredientRow.remove());

    ingredientRow.appendChild(selectElement);
    ingredientRow.appendChild(quantityInput);
    ingredientRow.appendChild(unitSelect);
    ingredientRow.appendChild(removeButton);

    document.getElementById('ingredientsContainer').appendChild(ingredientRow);
}


/**
 * Update a recipe.
 * @param recipeNameForm {HTMLInputElement} The form with the recipe name.
 * @param descriptionForm {HTMLInputElement} The input element for the description.
 * @param categoryForm {HTMLInputElement} The input element for the category.
 * @param prepTimeForm {HTMLInputElement} The input element for the prep time.
 * @param cookTimeForm {HTMLInputElement} The input element for the cook time.
 * @param servingsForm {HTMLInputElement} The input element for the number of servings.
 * @param instructionsForm {HTMLInputElement} The textarea with instructions.
 * @param ingredients {Array} Array of ingredient objects (with id, quantity, unit).
 * @param recipeID {String} The recipe to update's id.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function updateRecipe(recipeNameForm, descriptionForm, categoryForm, prepTimeForm, cookTimeForm, servingsForm, instructionsForm, ingredients, recipeID) {
    await fetch(`/api/update_recipe/${recipeID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            session_id: sessionID
        },
        body: JSON.stringify({
            RecipeName: recipeNameForm.value,
            Description: descriptionForm.value,
            Category: categoryForm.value,
            PrepTime: prepTimeForm.value,
            CookTime: cookTimeForm.value,
            Servings: servingsForm.value,
            Instructions: instructionsForm.value,
            Ingredients: ingredients
        })
    }).then(async (response) => {
        if (response.status === 200) {
            console.log("Recipe updated successfully");
            window.location.href = '/recipes.html';
        } else {
            console.error(await response.json());
            Swal.fire("Failed to update recipe");
        }
    }).catch((e) => {
        console.error(e);
        Swal.fire("An error occurred while updating the recipe");
    });
}

/**
 * Creates the recipe form.
 * @param recipe {Object|null|undefined} The recipe to update or null for a new recipe.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function createRecipeForm(recipe = null) {
    recipeForm.innerHTML = '';

    const heading = document.createElement("h1");
    heading.innerText = recipe ? "Edit Recipe" : "Add Recipe";
    heading.style.fontWeight = "bold";
    recipeForm.appendChild(heading);

    // Recipe Name
    const recipeNameLabel = document.createElement("label");
    recipeNameLabel.innerText = "Recipe Name";
    recipeForm.appendChild(recipeNameLabel);
    const recipeNameInput = document.createElement("input");
    recipeNameInput.className = "form-control";
    recipeNameInput.value = recipe ? recipe.RecipeName : "";
    recipeNameInput.placeholder = "Recipe name...";
    recipeNameInput.required = true;
    recipeForm.appendChild(recipeNameInput);

    // Description
    const descriptionLabel = document.createElement("label");
    descriptionLabel.innerText = "Description";
    recipeForm.appendChild(descriptionLabel);
    const descriptionInput = document.createElement("textarea");
    descriptionInput.className = "form-control";
    descriptionInput.value = recipe ? recipe.Description : "";
    descriptionInput.placeholder = "Recipe description...";
    descriptionInput.required = true;
    recipeForm.appendChild(descriptionInput);

    // Category
    const categoryLabel = document.createElement("label");
    categoryLabel.innerText = "Category";
    recipeForm.appendChild(categoryLabel);
    const categoryInput = document.createElement("input");
    categoryInput.className = "form-control";
    categoryInput.value = recipe ? recipe.Category : "";
    categoryInput.placeholder = "Category";
    categoryInput.required = true;
    recipeForm.appendChild(categoryInput);

    // Prep Time and Cook Time
    const prepTimeLabel = document.createElement("label");
    prepTimeLabel.innerText = "Preparation Time (minutes)";
    recipeForm.appendChild(prepTimeLabel);
    const prepTimeInput = document.createElement("input");
    prepTimeInput.className = "form-control";
    prepTimeInput.type = "number";
    prepTimeInput.value = recipe ? recipe.PrepTime : "";
    prepTimeInput.placeholder = "0";
    prepTimeInput.required = true;
    recipeForm.appendChild(prepTimeInput);

    const cookTimeLabel = document.createElement("label");
    cookTimeLabel.innerText = "Cooking Time (minutes)";
    recipeForm.appendChild(cookTimeLabel);
    const cookTimeInput = document.createElement("input");
    cookTimeInput.className = "form-control";
    cookTimeInput.type = "number";
    cookTimeInput.value = recipe ? recipe.CookTime : "";
    cookTimeInput.placeholder = "0";
    cookTimeInput.required = true;
    recipeForm.appendChild(cookTimeInput);

    // Servings
    const servingsLabel = document.createElement("label");
    servingsLabel.innerText = "Servings";
    recipeForm.appendChild(servingsLabel);
    const servingsInput = document.createElement("input");
    servingsInput.className = "form-control";
    servingsInput.type = "number";
    servingsInput.value = recipe ? recipe.Servings : "";
    servingsInput.placeholder = "0";
    servingsInput.required = true;
    recipeForm.appendChild(servingsInput);

    // **Ingredients Section**
    const ingredientsLabel = document.createElement('h3');
    ingredientsLabel.innerText = 'Ingredients';
    recipeForm.appendChild(ingredientsLabel);

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.id = 'ingredientsContainer';
    recipeForm.appendChild(ingredientsContainer);

    // Button to add ingredients dynamically
    const addIngredientButton = document.createElement('button');
    addIngredientButton.className = 'btn btn-success mt-3';
    addIngredientButton.type = 'button';
    addIngredientButton.innerText = 'Add Ingredient';
    addIngredientButton.addEventListener('click', addIngredientRow);
    recipeForm.appendChild(addIngredientButton);

    // Instructions
    const instructionsLabel = document.createElement("label");
    instructionsLabel.innerText = "Instructions";
    recipeForm.appendChild(instructionsLabel);
    const instructionsInput = document.createElement("textarea");
    instructionsInput.className = "form-control";
    instructionsInput.value = recipe ? recipe.Instructions : "";
    instructionsInput.placeholder = "Recipe instructions...";
    instructionsInput.required = true;
    recipeForm.appendChild(instructionsInput);

    // Submit Button
    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-primary mt-4";
    submitButton.innerText = recipe ? "Update Recipe" : "Add Recipe";
    submitButton.addEventListener("click", () => {
        const ingredients = []; // Collect ingredients here
        // Begin added section
        document.querySelectorAll('.ingredientRow').forEach(row => {
            const ingredientID = row.querySelector('.ingredientSelect').value;
            const quantity = row.querySelector('.ingredientQuantity').value;
            const unit = row.querySelector('.ingredientUnit').value;
            ingredients.push({ ingredientID, quantity, unit });
        });
        // end added section
        if (recipe) {
            updateRecipe(recipeNameInput, descriptionInput, categoryInput, prepTimeInput, cookTimeInput, servingsInput, instructionsInput, ingredients, recipe.RecipeID);
        } else {
            addRecipe(recipeNameInput, descriptionInput, categoryInput, prepTimeInput, cookTimeInput, servingsInput, instructionsInput, ingredients);
        }
    });
    recipeForm.appendChild(submitButton);
}
/**
 * Initialize the recipe form on page load.
 * @param recipeID {String|null} The ID of the recipe to load, or null for a new recipe.
 */
async function initRecipeForm(recipeID = null) {
    if (sessionID) {
        await fetchIngredients(); 
        if (recipeID) {
            const response = await fetch(`/api/recipe/${recipeID}`, {
                method: "GET",
                headers: { session_id: sessionID }
            });
            if (response.ok) {
                const recipeData = await response.json();
                await createRecipeForm(recipeData);
            } else {
                await createRecipeForm();
            }
        } else {
            await createRecipeForm();
        }
    } else {
        window.location.href = "/";
    }
}

const urlParams = new URLSearchParams(window.location.search);
const recipeID = urlParams.get("recipe");
initRecipeForm(recipeID).then(() => {});
