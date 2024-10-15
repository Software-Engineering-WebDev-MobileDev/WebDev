const ingredientForm = document.getElementById("ingredientFormContainer");
const unitsOfMeasure = ['g', 'kg', 'ml', 'l', 'oz', 'cups', 'lbs'];

// User's session_id to be used
const sessionID = localStorage.getItem('session_id');

async function getInventory(pageNumber = 1, pageSize = 30) {
    return await fetch('api/inventory',{
        method: 'GET',
        headers: {
            session_id: sessionID,
            page: pageNumber,
            page_size: pageSize
        }
    }).then(async (result) => {
        if (result.status === 200) {
            let result_json = await result.json();
            if (result_json["page_count"] > pageNumber) {
                let nextPage = await getInventory(pageNumber + 1, pageSize);
                return result_json["content"].concat(nextPage);
            }
            else {
                return result_json["content"];
            }
        }
    }).catch((e) => {
        console.error(e);
        return ["error"]
    });
}

/**
 * Updates an ingredient in the database.
 * @param ingredientID {String} The id of the ingredient.
 * @param name {HTMLSelectElement} The form for the name of the ingredient.
 * @param quantity {HTMLFormElement} The form for the quantity of the ingredient.
 * @param unitOfMeasurement {HTMLSelectElement} The form for the ingredient's unit of measure.
 * @returns {Promise<void>}
 */
async function updateIngredient(ingredientID, name, quantity, unitOfMeasurement) {
    fetch('/api/ingredient', {
        method: 'PUT',
        headers: {
            session_id: sessionID,
            inventory_id: name.options[name.selectedIndex].id,
            ingredient_id: ingredientID,
            quantity: quantity.value,
            unit_of_measurement: unitOfMeasurement.options[unitOfMeasurement.selectedIndex].value,
            name: name.options[name.selectedIndex].value,
        }
    }).then(async (result) => {
        if (result.status === 200) {
            console.log("Success");
            window.location.href = '/ingredient';
        }
        else {
            console.error(await result.json());
            Swal.fire("Invalid ingredient!");
        }
    }).catch((e) => {
        console.error(e);
        Swal.fire("Invalid ingredient!");
    })
}

/**
 * Adds an ingredient to the database.
 * @param name {HTMLSelectElement} The form for the name of the ingredient.
 * @param quantity {HTMLFormElement} The form for the quantity of the ingredient.
 * @param unitOfMeasurement {HTMLSelectElement} The form for the ingredient's unit of measure.
 * @returns {Promise<void>}
 */
async function addIngredient(name, quantity, unitOfMeasurement) {
    fetch('/api/ingredient', {
        method: 'POST',
        headers: {
            session_id: sessionID,
            inventory_id: name.options[name.selectedIndex].id,
            quantity: quantity.value,
            unit_of_measurement: unitOfMeasurement.options[unitOfMeasurement.selectedIndex].value
        }
    }).then(async (result) => {
        if (result.status === 201) {
            console.log("Success. Redirect to /ingredient");
            window.location.href = '/ingredient';
        }
        else {
            console.error(await result.json());
            Swal.fire("Invalid ingredient!");
        }
    }).catch((e) => {
        console.error(e);
        Swal.fire("Invalid ingredient!");
    })
}

/**
 * Creates the ingredient form, creation if an ingredient is supplied
 * @param ingredient {Object|null|undefined} The ingredient object from the API
 */
function createIngredientForm(ingredient = null) {
    ingredientForm.innerHTML = '';

    // Create the heading
    const heading = document.createElement("h1");
    if (ingredient) {
        heading.innerText = ingredient["Name"];
    }
    else {
        heading.innerText = "Create Ingredient";
    }
    heading.style.fontWeight = "bold";
    ingredientForm.appendChild(heading);

    if (ingredient) {
        const pageButtonDiv = document.createElement("div");
        pageButtonDiv.id = "pageButtonDiv";
        pageButtonDiv.align = "center";
        pageButtonDiv.style.display = "flex";
        pageButtonDiv.style.alignItems = "flex-end";
        pageButtonDiv.style.flexDirection = "row";
        pageButtonDiv.style.justifyContent = "center";

        // Button to go to the inventory page
        const inventoryViewButton = document.createElement("button");
        inventoryViewButton.id = "inventoryViewButton";
        inventoryViewButton.innerText = "Inventory Item";
        inventoryViewButton.className = "form-control btn btn-primary col-12 mt-4";
        inventoryViewButton.style.width = "40%";
        inventoryViewButton.style.marginBottom = "1em";
        inventoryViewButton.type = "button";
        inventoryViewButton.addEventListener(
            'mousedown',
            () => {
                window.location.href = `/inventory_view?inventory=${ingredient["InventoryID"]}`;
            }
        )
        pageButtonDiv.appendChild(inventoryViewButton);

        // Spacer between buttons
        const tabSpacer = document.createElement('p');
        tabSpacer.innerHTML = "&emsp;";
        pageButtonDiv.appendChild(tabSpacer);

        // Purchase order button
        const purchaseOrderButton = document.createElement('button');
        purchaseOrderButton.id = "purchaseOrderButton";
        purchaseOrderButton.innerText = "Purchase Order";
        purchaseOrderButton.className = "form-control btn btn-primary col-12 mt-4";
        purchaseOrderButton.style.width = "40%";
        purchaseOrderButton.style.marginBottom = "1em";
        purchaseOrderButton.type = "button";
        purchaseOrderButton.addEventListener(
            'mousedown',
            () => {
                window.location.href = `/purchase_order?inventory=${ingredient["InventoryID"]}`;
            }
        )
        pageButtonDiv.appendChild(purchaseOrderButton);

        ingredientForm.appendChild(pageButtonDiv);
    }
    else {
        ingredientForm.appendChild(document.createElement('br'));
    }

    // Create the name label
    const ingredientNameLabel = document.createElement("label");
    ingredientNameLabel.innerText = "Ingredient Name";
    ingredientNameLabel.for = "ingredientNameInput";
    ingredientNameLabel.className = "control-label";
    ingredientForm.appendChild(ingredientNameLabel);

    // Name field
    const ingredientNameSelect = document.createElement("select");
    ingredientNameSelect.id = "ingredientNameInput";
    ingredientNameSelect.className = "form-control";
    ingredientNameSelect.required = true;
    ingredientNameSelect.ariaRequired = "true";

    getInventory().then((result) => {
        result.forEach((inventory) => {
            const inventoryOption = document.createElement('option');
            inventoryOption.id = inventory["InventoryID"];
            inventoryOption.innerText = inventory["Name"];
            if (ingredient && inventory["Name"] === ingredient["Name"]) {
                inventoryOption.selected = true;
            }
            ingredientNameSelect.appendChild(inventoryOption);
        })
    })
    ingredientForm.appendChild(ingredientNameSelect);
    ingredientForm.appendChild(document.createElement('br'));

    // Quantity label
    const quantityLabel = document.createElement("label");
    quantityLabel.for = "quantityInput";
    quantityLabel.innerHTML = "Quantity";
    quantityLabel.className = "control-label";
    ingredientForm.appendChild(quantityLabel);

    // Quantity input
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    if (ingredient) {
        quantityInput.value = ingredient["Quantity"];
    }
    else {
        quantityInput.placeholder = "0";
    }
    quantityInput.min = "1";
    quantityInput.max = "999999999";
    quantityInput.required = true;
    quantityInput.ariaRequired = "true";
    quantityInput.className = "form-control";
    quantityInput.id = "quantityInput";
    ingredientForm.appendChild(quantityInput);
    ingredientForm.appendChild(document.createElement('br'));

    // Unit of measure label
    const unitOfMeasureLabel = document.createElement("label");
    unitOfMeasureLabel.innerText = "Unit";
    unitOfMeasureLabel.className = "control-label";
    unitOfMeasureLabel.for = "unitOfMeasureForm";
    ingredientForm.appendChild(unitOfMeasureLabel);

    // Unit input form
    const unitOfMeasureForm = document.createElement('select');
    unitOfMeasureForm.className = "form-control";
    unitOfMeasureForm.id = "unitOfMeasureForm";
    unitOfMeasureForm.name = "unitOfMeasureForm";
    unitOfMeasureForm.required = true;
    unitOfMeasureForm.ariaRequired = "true";

    for (const unit of unitsOfMeasure) {
        const unitElement = document.createElement('option');
        if (ingredient && unit === ingredient["UnitOfMeasure"]) {
            unitElement.selected = true;
        }
        unitElement.innerText = unit;
        unitElement.id = unit;
        unitOfMeasureForm.appendChild(unitElement);
    }

    ingredientForm.appendChild(unitOfMeasureForm);
    ingredientForm.appendChild(document.createElement('br'));

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = "button";
    submitButton.id = "submitIngredientButton";
    submitButton.className = "form-control btn btn-primary col-12 mt-4";
    submitButton.style.width = "50%";
    submitButton.style.marginBottom = "1em";
    if (ingredient) {
        submitButton.innerHTML = "Update";
        submitButton.addEventListener(
            'mousedown',
            () => {
                const name = document.getElementById("ingredientNameInput");
                const quantity = document.getElementById("quantityInput");
                const unitOfMeasure = document.getElementById("unitOfMeasureForm");

                if (quantity.value > 999_999_999 || quantity.value <= 0) {
                    Swal.fire("Invalid quantity");
                }
                else {
                    updateIngredient(ingredient["IngredientID"], name, quantity, unitOfMeasure).then(() => {});
                }
            }
        )
    }
    else {
        submitButton.innerText = "Submit";
        submitButton.addEventListener(
            'mousedown',
            () => {
                const name = document.getElementById("ingredientNameInput");
                const quantity = document.getElementById("quantityInput");
                const unitOfMeasure = document.getElementById("unitOfMeasureForm");

                if (quantity.value > 999_999_999 || quantity.value <= 0) {
                    Swal.fire("Invalid quantity");
                }
                else {
                    addIngredient(name, quantity, unitOfMeasure).then(() => {});
                }
            }
        )
    }
    const submitButtonDiv = document.createElement("div");
    submitButtonDiv.id = "submitButtonDiv";
    submitButtonDiv.align = "center";
    submitButtonDiv.appendChild(submitButton);
    ingredientForm.appendChild(submitButtonDiv);

    if (ingredient) {
        // Set the title when we are done
        document.title = ingredient["Name"];
    }
    else {
        // Set the title when we are done
        document.title = "Create an ingredient";
    }
}

/**
 * Gets the ingredient from the API and calls the renderer.
 * Returns home if the session is invalid.
 * Renders the "create" version of the form if no valid ingredient is supplied.
 * @param ingredientID {String} The ingredient id to get from the API.
 * @returns {Promise<void>} Nothing, await if needed.
 */
async function getIngredient(ingredientID) {
    if (sessionID) {
        if (ingredientID) {
            await fetch(`/api/ingredient`,
                {
                    method: 'GET',
                    headers: {
                        session_id: sessionID,
                        ingredient_id: ingredientID
                    },
                }
            ).then(async (response) => {
                    if (response.status === 200) {
                        let ingredientObject = await response.json();
                        await fetch('api/inventory_item', {
                            method: 'GET',
                            headers: {
                                session_id: sessionID,
                                inventory_id: ingredientObject["content"]["InventoryID"]
                            }
                        }).then((result) => {
                            createIngredientForm({...ingredientObject["content"], ...result["content"]});
                        }).catch((e) => {
                            console.error(e);
                            createIngredientForm();
                        });
                    }
                    else {
                        createIngredientForm();
                    }
                }
            ).catch(() => {
                createIngredientForm();
            });
        }
        else {
            createIngredientForm();
        }
    }
    else {
        console.log("User is not logged in!");
        // Return to home if the user is not logged in
        window.location.href = "/";
    }
}



const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get("ingredient"));
const ingredient = urlParams.get("ingredient");

getIngredient(ingredient).then(() => {
});
