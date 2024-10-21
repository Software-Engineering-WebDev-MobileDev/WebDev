// Fetch session_id if required
const sessionID = localStorage.getItem('session_id');

// Get the ingredient list container
const ingredientListContainer = document.getElementById('ingredient-list');

// Fetch ingredients from the backend API
async function fetchIngredients() {
    try {
        const response = await fetch('/api/ingredients', {
            method: 'GET',
            headers: {
                'session_id': sessionID
            }
        });

        if (response.status === 200) {
            return await response.json();
        } else {
            console.error('Failed to fetch ingredients');
            return [];
        }
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }
}

// Render the ingredient list
async function renderIngredients() {
    const ingredients = await fetchIngredients();

    // Clear the container before adding new ingredients
    ingredientListContainer.innerHTML = '';

    // Loop through the ingredients and create list items
    ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('a');
        ingredientItem.href = `/ingredient_view?ingredient=${ingredient.id}`;
        console.log(ingredient);
        ingredientItem.className = 'list-group-item list-group-item-action';
        ingredientItem.innerHTML = `
            <h5 class="mb-1">${ingredient.name}</h5>
            <p class="mb-1">Quantity: ${ingredient.quantity} ${ingredient.unit}</p>
        `;

        ingredientListContainer.appendChild(ingredientItem);
    });
}

// Initialize the ingredient list rendering
document.addEventListener('DOMContentLoaded', () => {
    renderIngredients();
});
