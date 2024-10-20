// Get the container where ingredients will be displayed
const contentContainer = document.getElementById("contentContainer");

// User's session_id to be used
const sessionID = localStorage.getItem('session_id');

// document.getElementById('addInventoryButton').addEventListener('click', function() {
//     // Redirect to inventory_view.html
//     window.location.href = '/inventory_view.html';
// });

/**
 * Fetches the inventory list from the API.
 * @param {number} pageNumber - The page number to fetch.
 * @param {number} pageSize - The number of items per page.
 * @returns {Promise<array>} - Returns an array of inventory items or an empty array if an error occurs.
 */
async function getInventory(pageNumber = 1, pageSize = 20) {
    try {
        const response = await fetch('/api/inventory', {
            method: 'GET',
            headers: {
                session_id: sessionID,
                page: pageNumber,
                page_size: pageSize
            }
        });

        const result = await response.json();

        if (response.status === 200 && result.status === 'success') {
            return result.content;
        } else {
            console.error(result.reason);
            return [];
        }
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return [];
    }
}

/**
 * Renders the inventory list to the content container.
 * @param {Array} inventoryList - The array of inventory items to display.
 */
function renderInventory(inventoryList) {
    // Clear previous content
    contentContainer.innerHTML = '';

    if (inventoryList.length === 0) {
        contentContainer.innerHTML = '<p>No ingredients available.</p>';
        return;
    }

    inventoryList.forEach((item) => {
        console.log('Item:', item);
        // Create a card element for each inventory item
        const card = document.createElement('div');
        card.className = 'card mb-3 d-flex flex-row justify-content-between align-items-center';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Name of the ingredient
        const ingredientName = document.createElement('h5');
        ingredientName.className = 'card-title';
        ingredientName.innerText = item.Name;
        cardBody.appendChild(ingredientName);

        // Additional details (like shelf life, reorder amount, etc.)
        const ingredientDetails = document.createElement('p');
        ingredientDetails.className = 'card-text';
        ingredientDetails.innerText = `Shelf Life: ${item.ShelfLife || 'N/A'} ${item.ShelfLifeUnit || ''}, Stock Amount: ${item.ReorderAmount || 'N/A'} ${item.ReorderUnit || ''}`;
        cardBody.appendChild(ingredientDetails);

        card.appendChild(cardBody);

        // Create the Edit Ingredient button
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning';
        editButton.innerText = 'Edit Ingredient';

        // Add margin to the right of the button
        editButton.style.marginRight = '20px';
        
        // Redirect to the edit page, passing the ingredient ID in the URL
        editButton.addEventListener('click', function() {
            window.location.href = `/edit_ingredient.html?ingredient=${item.InventoryID}`;
        });

        card.appendChild(editButton); // Add the button to the card

        contentContainer.appendChild(card);
    });
}



/**
 * Initializes the page by fetching and displaying the inventory.
 */
async function init() {
    const inventoryList = await getInventory();
    renderInventory(inventoryList);
// }

document.getElementById('addInventoryButton').addEventListener('click', function() {
    // Redirect to the page where new inventory can be added
    window.location.href = '/inventory_view.html';
});

document.getElementById('viewIngredientButton').addEventListener('click', function() {
    // Redirect to the view page for the selected ingredient (you might need to set this dynamically)
    const ingredientID = 'some-ingredient-id'; // Replace with actual logic to get the ingredient ID
    window.location.href = `/ingredient_view.html?ingredient=${ingredientID}`;
});
}

// Call the init function when the page loads
init();
