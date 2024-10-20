const sessionID = localStorage.getItem('session_id');
console.log(sessionID)
const inventoryForm = document.getElementById("inventoryFormContainer");
const unitsOfMeasure = ['g', 'kg', 'ml', 'l', 'oz', 'cups', 'lbs'];
const shelfLifeMeasure = ['days', 'weeks', 'months', 'years'];

// Get the inventoryID from the URL (if available)
const urlParams = new URLSearchParams(window.location.search);
const inventoryID = urlParams.get("ingredient");

/**
 * Fetches and pre-fills the form with the existing inventory item data.
 */
async function loadInventoryItem(inventoryID) {
    console.log("Inventory ID being sent to backend:", inventoryID);
    try {
        const response = await fetch(`api/inventory_item`, {
            method: "GET",
            headers: {
                session_id: sessionID, 
                inventory_id: inventoryID 
            }
        });
        console.log(response);

        if (response.ok) {
            const inventoryItem = await response.json();
            console.log(inventoryItem)
            populateForm(inventoryItem['content']);
        } else {
            console.error('Failed to retrieve item data.');
            populateForm();  // Load an empty form in case of failure
        }
    } catch (error) {
        console.error('Error fetching the inventory item:', error);
        populateForm();  // Handle error gracefully
    }
}

/**
 * Populates the form with either the inventory item data or loads an empty form.
 */
function populateForm(inventoryItem = {}) {
    inventoryForm.innerHTML = '';  // Clear any existing content

    // Add a title for the form
    const title = document.createElement('h2');
    title.innerText = "Edit Inventory Item";
    title.className = "form-title";  // You can style this class in your CSS for custom styling
    title.style.textAlign = "center"; // Align the title to the center
    //title.style.marginBottom = "1em";  // Add some space below the title

    inventoryForm.appendChild(title);  // Append the title to the form container

    // Log to check ReorderUnit
    console.log("ReorderUnit from inventoryItem:", inventoryItem.ReorderUnit);

    const nameInput = createInputField("inventoryNameInput", "Ingredient Name", inventoryItem.Name || '');
    const shelfLifeInput = createInputField("shelfLifeInput", "Shelf Life", inventoryItem.ShelfLife || '');
    const shelfLifUnitInput = createSelectField(
        "shelfLifUnitInput",
        "Unit",
        shelfLifeMeasure,
        inventoryItem.shelfLifeUnit || ''  // Ensure ReorderUnit is passed or default to an empty string
    );
    const reorderAmountInput = createInputField("reorderInput", "Stock Amount", inventoryItem.ReorderAmount || '');
    
    // Handle reorder unit selection, logging the selected value
    const reorderUnitInput = createSelectField(
        "reorderUnit",
        "Unit",
        unitsOfMeasure,
        inventoryItem.ReorderUnit || ''  // Ensure ReorderUnit is passed or default to an empty string
    );

    inventoryForm.append(nameInput.label, nameInput.input);
    inventoryForm.append(shelfLifeInput.label, shelfLifeInput.input);
    inventoryForm.append(shelfLifUnitInput.label, shelfLifUnitInput.select);
    inventoryForm.append(reorderAmountInput.label, reorderAmountInput.input);
    inventoryForm.append(reorderUnitInput.label, reorderUnitInput.select);

    // Create and append the update button inside a centered div
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = "center"; 

    // Create and append the update button
    const submitButton = document.createElement('button');
    submitButton.className = "form-control btn btn-primary mt-4";
    submitButton.type = "button";
    submitButton.id = "submitIngredientButton";
    submitButton.style.width = "50%";
    submitButton.style.marginBottom = "1em";
    submitButton.innerHTML = "Update";

    submitButton.addEventListener('click', () => {
        updateInventoryItem({
            name: document.getElementById("inventoryNameInput").value,
            shelf_life: document.getElementById("shelfLifeInput").value,
            reorder_amount: document.getElementById("reorderInput").value,
            reorder_unit: document.getElementById("reorderUnit").value
        });
    });
    
    inventoryForm.appendChild(submitButton);
}

/**
 * Creates a text input field with a label.
 */
function createInputField(id, labelText, value = '') {
    const label = document.createElement("label");
    label.innerText = labelText;

    const input = document.createElement("input");
    input.id = id;
    input.className = "form-control";
    input.type = "text";
    input.value = value;

    return { label, input };
}

/**
 * Creates a select field with options from an array.
 */
function createSelectField(id, labelText, options, selectedValue = '') {
    const label = document.createElement("label");
    label.innerText = labelText;

    const select = document.createElement("select");
    select.id = id;
    select.className = "form-control";

    // Log selected value to check what is being passed
    console.log("Creating select field for:", id, "Selected value:", selectedValue);

    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.text = option;

        // Explicitly set the selected option
        if (option === selectedValue) {
            opt.selected = true;
        }

        select.appendChild(opt);
    });

    return { label, select };
}


/**
 * Updates the inventory item with new form data.
 */
async function updateInventoryItem(data) {
    try {
        const response = await fetch(`/api/inventory_item`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specify that the body will be JSON
                session_id: sessionID,              // Send session ID as a header
                inventory_id: inventoryID,          // Send inventory ID as a header
                name: document.getElementById("inventoryNameInput").value,
                shelf_life: document.getElementById("shelfLifeInput").value,
                shelf_life_unit: document.getElementById("shelfLifUnitInput").options[document.getElementById("shelfLifUnitInput").selectedIndex].value,
                reorder_amount: document.getElementById("reorderInput").value,
                reorder_unit: document.getElementById("reorderUnit").value
            },
            body: JSON.stringify(data)              // Send the form data in the body of the request
        });

        if (response.ok) {
            window.location.href = '/ingredient';  // Redirect to ingredients page on success
        } else {
            const errorData = await response.json();
            console.error('Failed to update:', errorData);
            Swal.fire("Failed to update ingredient");
        }
    } catch (error) {
        console.error('Error updating the inventory item:', error);
        Swal.fire("Failed to update ingredient");
    }
}

// Load the inventory item details and set up the form on page load
loadInventoryItem(inventoryID);
