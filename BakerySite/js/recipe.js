const sessionID = localStorage.getItem('session_id');
const recipeContainer = document.getElementById('recipeContainer');

async function getRecipes() {
    if (sessionID) {
        return fetch("/api/recipes", {
            method: "GET",
            headers: {
                session_id: sessionID
            }
        }).then(async (response) => {
            if (response.status === 200) {
                let recipes = await response.json();
                console.log(recipes);
                return recipes["recipe"];
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
        window.location.href = "/";
    }
}

function recipeCard(recipe) {
    const cardDiv = document.createElement("div");
    cardDiv.id = recipe["RecipeID"];
    cardDiv.role = "button";

    const cardTitle = document.createElement("h3");
    cardTitle.style.fontWeight = "bold";
    cardTitle.innerText = recipe["RecipeName"];
    cardDiv.appendChild(cardTitle);

    const cardTime = document.createElement("p");
    cardTime.innerText = `Prep: ${recipe["PrepTime"]}\tCook: ${recipe["CookTime"]}`;
    cardDiv.appendChild(cardTime);

    cardDiv.addEventListener(
        "mousedown",
        () => {
            window.location.href = `/recipe_view?recipe=${recipe["RecipeID"]}`;
        }
    );
    return cardDiv;
}

async function renderRecipePage(recipeList) {
    console.log(recipeList)
    recipeContainer.innerHTML = '';
    for (const recipe of recipeList) {
        recipeContainer.appendChild(recipeCard(recipe));
    }
}

getRecipes().then((recipes) => {
    if (recipes !== "error") {
        renderRecipePage(recipes).then(() => {
        });
    }
    else {
        alert("Error fetching recipes!")
    }
});
