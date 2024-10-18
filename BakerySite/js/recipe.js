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

// adds recipes to page as buttons
async function addRecipes() {
    try {
        if (recipeList.length === 0){
            recipeList = await fetchRecipes();
            
        }
        recipeList["recipes"].sort((a,b) => a.RecipeName.localeCompare(b.RecipeName));
        recipeIDForm.innerHTML = '';
        const rowNew = document.createElement('div');
        rowNew.className = "row g-2 justify-content-center";
        rowNew.id = 'row';
        recipeIDForm.appendChild(rowNew)

        recipeList["recipes"].forEach((recipe) => {
            const recipeButton = document.createElement('button');
            recipeButton.id = recipe["RecipeID"];
            recipeButton.className = "btn col-lg-2 col-md-3 col-sm-4 mx-1";
            recipeButton.style = "background-color: #f5c976;"
            recipeButton.type = "button";
            recipeButton.innerText = recipe["RecipeName"];
            rowNew.appendChild(recipeButton);
        });
    } catch (e) {
        console.error(e);
    }
}

addRecipes();