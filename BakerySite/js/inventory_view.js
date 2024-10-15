const sessionID = localStorage.getItem('session_id');
const inventoryForm = document.getElementById("inventoryFormContainer");
const timeUnits = ["days", "weeks", "months", "years"];
const unitsOfMeasure = ['g', 'kg', 'ml', 'l', 'oz', 'cups', 'lbs'];

/**
 * Add an item to the inventory.
 * @param nameForm {HTMLInputElement} The form with the name of the new ingredient.
 * @param shelfLifeForm {HTMLInputElement} The input element for shelf life.
 * @param shelfLifeUnitForm {HTMLSelectElement} The select element for the shelf life unit.
 * @param reorderAmountForm {HTMLFormElement} The input element for the reorder amount.
 * @param reorderUnitForm {HTMLSelectElement} The select element for the reorder amount unit.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function addInventoryItem(nameForm, shelfLifeForm, shelfLifeUnitForm, reorderAmountForm, reorderUnitForm) {
    await fetch('/api/inventory_item', {
        method: 'POST',
        headers: {
            session_id: sessionID,
            name: nameForm.value,
            shelf_life: shelfLifeForm.value,
            shelf_life_unit: shelfLifeUnitForm.options[shelfLifeUnitForm.selectedIndex].value,
            reorder_amount: reorderAmountForm.value,
            reorder_unit: reorderUnitForm.options[reorderUnitForm.selectedIndex].value
        }
    }).then(async (response) => {
        if (response.status === 201) {
            console.log('Inventory Added. Redirect to other page');
        }
        else {
            console.error(await response.json());
            Swal.fire("Invalid inventory item");
        }
    }).catch((e) => {
        console.error(e);
        Swal.fire("Invalid inventory item");
    })
}

/**
 * Update an item in the inventory.
 * @param nameForm {HTMLInputElement} The form with the name of the ingredient.
 * @param shelfLifeForm {HTMLInputElement} The input element for shelf life.
 * @param shelfLifeUnitForm {HTMLSelectElement} The select element for the shelf life unit.
 * @param reorderAmountForm {HTMLFormElement} The input element for the reorder amount.
 * @param reorderUnitForm {HTMLSelectElement} The select element for the reorder amount unit.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function updateInventoryItem(nameForm, shelfLifeForm, shelfLifeUnitForm, reorderAmountForm, reorderUnitForm, inventoryID) {
    await fetch('/api/inventory_item', {
        method: 'PUT',
        headers: {
            session_id: sessionID,
            name: nameForm.value,
            shelf_life: shelfLifeForm.value,
            shelf_life_unit: shelfLifeUnitForm.options[shelfLifeUnitForm.selectedIndex].value,
            reorder_amount: reorderAmountForm.value,
            reorder_unit: reorderUnitForm.options[reorderUnitForm.selectedIndex].value,
            inventory_id: inventoryID
        }
    }).then(async (response) => {
        if (response.status === 200) {
            console.log('Inventory updated. Redirect to other page');
        }
        else {
            console.error(await response.json());
            Swal.fire("Invalid inventory item");
        }
    }).catch((e) => {
        console.error(e);
        Swal.fire("Invalid inventory item");
    })
}

/**
 * Creates the inventory item form.
 * @param inventoryItem {Object|null|undefined} The inventory item to update or nothing.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function createInventoryForm(inventoryItem = null) {
    inventoryForm.innerHTML = '';

    // Create the heading
    const heading = document.createElement("h1");
    if (inventoryItem) {
        heading.innerText = inventoryItem["Name"];
    }
    else {
        heading.innerText = "Create Inventory Item";
    }
    heading.style.fontWeight = "bold";
    inventoryForm.appendChild(heading);

    // Create the name label
    const inventoryNameLabel = document.createElement("label");
    inventoryNameLabel.innerText = "Item Name";
    inventoryNameLabel.htmlFor = "inventoryNameInput";
    inventoryNameLabel.className = "control-label";
    inventoryForm.appendChild(inventoryNameLabel);

    // Name field
    const inventoryNameInput = document.createElement("input");
    inventoryNameInput.id = "inventoryNameInput";
    inventoryNameInput.className = "form-control";
    inventoryNameInput.type = "text";
    if (inventoryItem) {
        inventoryNameInput.value = inventoryItem["Name"];
    }
    else {
        inventoryNameInput.placeholder = "Item name...";
    }
    inventoryNameInput.minLength = 1;
    inventoryNameInput.maxLength = 50;
    inventoryNameInput.pattern = "[\\w\\s.,*\\/]+";
    inventoryNameInput.required = true;
    inventoryNameInput.ariaRequired = "true";
    inventoryForm.appendChild(inventoryNameInput);

    // Shelf life label
    const shelfLifeLabel = document.createElement("label");
    shelfLifeLabel.htmlFor = "shelfLifeInput";
    shelfLifeLabel.className = "control-label";
    shelfLifeLabel.id = "shelfLifeInputLabel";
    shelfLifeLabel.innerText = "Shelf Life";
    inventoryForm.appendChild(shelfLifeLabel);

    // Shelf life form
    const shelfLifeInput = document.createElement("input");
    shelfLifeInput.id = "shelfLifeInput";
    shelfLifeInput.className = "form-control";
    shelfLifeInput.type = "number";
    shelfLifeInput.max = "999999999"
    shelfLifeInput.min = "1"
    shelfLifeInput.required = true;
    shelfLifeInput.ariaRequired = "true";
    shelfLifeInput.title = "Shelf Life";
    if (inventoryItem) {
        shelfLifeInput.value = inventoryItem["ShelfLife"];
    }
    else {
        shelfLifeInput.placeholder = "0";
    }
    inventoryForm.appendChild(shelfLifeInput);

    // Unit of measure label
    const shelfLifeUnitOfMeasureLabel = document.createElement("label");
    shelfLifeUnitOfMeasureLabel.innerText = "Shelf life Unit";
    shelfLifeUnitOfMeasureLabel.className = "control-label";
    shelfLifeUnitOfMeasureLabel.htmlFor = "shelfLifeUnit";
    inventoryForm.appendChild(shelfLifeUnitOfMeasureLabel);

    // Unit input form
    const shelfLifeUnitOfMeasureForm = document.createElement('select');
    shelfLifeUnitOfMeasureForm.className = "form-control";
    shelfLifeUnitOfMeasureForm.id = "shelfLifeUnit";
    shelfLifeUnitOfMeasureForm.name = "shelfLifeUnit";
    shelfLifeUnitOfMeasureForm.required = true;
    shelfLifeUnitOfMeasureForm.ariaRequired = "true";

    for (const unit of timeUnits) {
        const unitElement = document.createElement('option');
        if (inventoryItem && unit === inventoryItem["ShelfLifeUnit"]) {
            unitElement.selected = true;
        }
        unitElement.innerText = unit;
        shelfLifeUnitOfMeasureForm.appendChild(unitElement);
    }

    inventoryForm.appendChild(shelfLifeUnitOfMeasureForm);

    // Reorder label
    const reorderLabel = document.createElement("label");
    reorderLabel.htmlFor = "reorderInput";
    reorderLabel.className = "control-label";
    reorderLabel.id = "reorderInputLabel";
    reorderLabel.innerText = "Reorder Amount";
    inventoryForm.appendChild(reorderLabel);

    // Reorder form
    const reorderInput = document.createElement("input");
    reorderInput.id = "reorderInput";
    reorderInput.className = "form-control";
    reorderInput.type = "number";
    reorderInput.max = "999999999"
    reorderInput.min = "1"
    reorderInput.required = true;
    reorderInput.ariaRequired = "true";
    reorderInput.title = "Reorder Amount";
    if (inventoryItem) {
        reorderInput.value = inventoryItem["ReorderAmount"];
    }
    else {
        reorderInput.placeholder = "0";
    }
    inventoryForm.appendChild(reorderInput);

    // Unit of measure label
    const reorderUnitOfMeasureLabel = document.createElement("label");
    reorderUnitOfMeasureLabel.innerText = "Reorder Unit";
    reorderUnitOfMeasureLabel.className = "control-label";
    reorderUnitOfMeasureLabel.htmlFor = "reorderUnit";
    inventoryForm.appendChild(reorderUnitOfMeasureLabel);

    // Unit input form
    const reorderUnitOfMeasureForm = document.createElement('select');
    reorderUnitOfMeasureForm.className = "form-control";
    reorderUnitOfMeasureForm.id = "reorderUnit";
    reorderUnitOfMeasureForm.name = "reorderUnit";
    reorderUnitOfMeasureForm.title = "Reorder Unit";
    reorderUnitOfMeasureForm.required = true;
    reorderUnitOfMeasureForm.ariaRequired = "true";

    for (const unit of unitsOfMeasure) {
        const unitElement = document.createElement('option');
        if (inventoryItem && unit === inventoryItem["ReorderUnit"]) {
            unitElement.selected = true;
        }
        unitElement.innerText = unit;
        reorderUnitOfMeasureForm.appendChild(unitElement);
    }

    inventoryForm.appendChild(reorderUnitOfMeasureForm);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = "button";
    submitButton.id = "submitItemButton";
    submitButton.className = "form-control btn btn-primary col-12 mt-4";
    submitButton.style.width = "50%";
    submitButton.style.marginBottom = "1em";
    if (inventoryItem) {
        submitButton.innerHTML = "Update";
        submitButton.addEventListener(
            'mousedown',
            () => {
                const name = document.getElementById("inventoryNameInput");
                const shelfLife = document.getElementById("shelfLifeInput");
                const shelfLifeUnit = document.getElementById("shelfLifeUnit");
                const reorderAmount = document.getElementById("reorderInput");
                const reorderUnitOfMeasure = document.getElementById("reorderUnit");

                if (!name.value.match(/^[\w\s.,*/]{1,50}$/)) {
                    Swal.fire("Invalid name format!");
                }
                else if (shelfLife.value > 999_999_999) {
                    Swal.fire("Shelf life too large!");
                }
                else if (shelfLife.value <= 0) {
                    Swal.fire("Shelf life too small!");
                }
                else if (reorderAmount.value <= 0) {
                    Swal.fire("Reorder Amount too small!");
                }
                else if (reorderAmount.value > 999_999_999) {
                    Swal.fire("Reorder Amount too large!");
                }
                else {
                    updateInventoryItem(name, shelfLife, shelfLifeUnit, reorderAmount, reorderUnitOfMeasure, inventoryItem["InventoryID"]);
                }
            }
        )
    }
    else {
        submitButton.innerText = "Submit";
        submitButton.addEventListener(
            'mousedown',
            () => {
                const name = document.getElementById("inventoryNameInput");
                const shelfLife = document.getElementById("shelfLifeInput");
                const shelfLifeUnit = document.getElementById("shelfLifeUnit");
                const reorderAmount = document.getElementById("reorderInput");
                const reorderUnitOfMeasure = document.getElementById("reorderUnit");

                if (!name.value.match(/^[\w\s.,*/]{1,50}$/)) {
                    Swal.fire("Invalid name format!");
                }
                else if (shelfLife.value > 999_999_999) {
                    Swal.fire("Shelf life too large!");
                }
                else if (shelfLife.value <= 0) {
                    Swal.fire("Shelf life too small!");
                }
                else if (reorderAmount.value <= 0) {
                    Swal.fire("Reorder Amount too small!");
                }
                else if (reorderAmount.value > 999_999_999) {
                    Swal.fire("Reorder Amount too large!");
                }
                else {
                    addInventoryItem(name, shelfLife, shelfLifeUnit, reorderAmount, reorderUnitOfMeasure);
                }
            }
        )
    }

    const submitButtonDiv = document.createElement("div");
    submitButtonDiv.id = "submitButtonDiv";
    submitButtonDiv.align = "center";
    submitButtonDiv.appendChild(submitButton);
    inventoryForm.appendChild(submitButtonDiv);

    if (inventoryItem) {
        // Set the title when we are done
        document.title = inventoryItem["Name"];
    }
    else {
        // Set the title when we are done
        document.title = "Create an inventory item";
    }
}

async function getInventoryItem(inventoryID) {
    if (sessionID) {
        if (inventoryID) {
            await fetch(`/api/inventory_item`, {
                method: "GET",
                headers: {
                    session_id: sessionID,
                    inventory_id: inventoryID
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    let inventoryItem = await response.json();
                    await createInventoryForm(inventoryItem["content"]);
                }
                else {
                    await createInventoryForm();
                }
            }).catch((e) => {
                console.error(e);
                createInventoryForm();
            });
        }
        else {
            await createInventoryForm();
        }
    }
    else {
        console.log("User is not logged in!");
        // Return to home if the user is not logged in
        window.location.href = "/";
    }
}

const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get("inventory"));
const inventory = urlParams.get("inventory");

getInventoryItem(inventory).then(() => {});