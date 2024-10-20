// User's session_id to be used
const sessionID = localStorage.getItem('session_id');

// variable to hold recipes from the api
let recipeList = []

// recipe container
const recipeIDForm = document.getElementById('divRecipes');

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
        }).then((data) => {
            console.log("Fetched recipes:", data); // Log the full response
            return data;
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

async function getRecipes() {
    try {
        if (recipeList.length === 0) {
            recipeList = await fetchRecipes();
        }

        recipeIDForm.innerHTML = '';  // Clear the container

        // Check if the recipe list contains any recipes
        if (recipeList["recipes"] && recipeList["recipes"].length > 0) {
            recipeList["recipes"].sort((a, b) => a.RecipeName.localeCompare(b.RecipeName));

            const rowNew = document.createElement('div');
            rowNew.className = "row g-2 justify-content-center";
            rowNew.id = 'row';
            recipeIDForm.appendChild(rowNew);

            recipeList["recipes"].forEach((recipe) => {
                const recipeButton = document.createElement('button');
                recipeButton.id = recipe["RecipeID"];
                recipeButton.className = "btn col-lg-2 col-md-3 col-sm-4 mx-1";
                recipeButton.style = "background-color: #f5c976;";
                recipeButton.type = "button";
                recipeButton.innerText = recipe["RecipeName"];

                recipeButton.onclick = function () {
                    window.location.href = 'recipe_view.html?recipe=' + recipe.RecipeID;
                    userLoc = recipe.RecipeName;
                    setUserLocation(userLoc);
                };

                rowNew.appendChild(recipeButton);
            });
        } else {
            // No recipes found, display a message
            const noRecipesMessage = document.createElement('p');
            noRecipesMessage.className = "text-center mt-4";
            noRecipesMessage.style.color = "#8c481b";  // Set a custom color if needed
            noRecipesMessage.innerText = "No recipes found. Please add a new recipe.";

            recipeIDForm.appendChild(noRecipesMessage);
        }
    } catch (e) {
        console.error(e);
        const errorMessage = document.createElement('p');
        errorMessage.className = "text-center mt-4";
        errorMessage.style.color = "red";  // Color for error messages
        errorMessage.innerText = "An error occurred while fetching recipes.";
        recipeIDForm.appendChild(errorMessage);
    }
}

getRecipes(); 

document.getElementById('btnAddRecipe').addEventListener('click', function() {
    // Redirect to the add recipe page
    window.location.href = '/add_recipe.html';
});

