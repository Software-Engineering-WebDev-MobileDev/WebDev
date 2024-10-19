const sessionID = localStorage.getItem('session_id');
const purchaseOrderFormContainer = document.getElementById('purchaseOrderFormContainer');

/**
 * Gets all inventory items from the API.
 * @param pageNumber {Number} Page number to get (used in recursive calls).
 * @param pageSize {Number} The size of each page to get (used in recursive calls).
 * @returns {Promise<*|[string]>} Array of Inventory item objects.
 */
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
 * Submit a purchase order.
 * @param inventoryID {String} The inventory id of the item the purchase order is for.
 * @param dateForm {HTMLInputElement} The date form.
 * @param orderQuantity {HTMLInputElement} The order quantity form.
 * @param vendor {HTMLInputElement} The vendor input form.
 * @param payableAmount {HTMLInputElement} The payable amount form.
 * @param payableDate {HTMLInputElement} The payable date form.
 * @returns {Promise<void>}
 */
async function submitPurchaseOrder(inventoryID, dateForm, orderQuantity, vendor, payableAmount, payableDate) {
    const date =  new Date(dateForm.value);
    const payableDateValue = new Date(payableDate.value);
    await fetch('/api/purchase_order', {
        method: 'POST',
        headers: {
            session_id: sessionID,
            inventory_id: inventoryID,
            po_date: date.toISOString(),
            order_quantity: orderQuantity.value,
            vendor: vendor.value,
            payable_amount: payableAmount.value,
            payable_date: payableDateValue.toISOString()
        }
    }).then(async (response) => {
        if (response.status === 201) {
            console.log(await response.json());
            // Go back to the ingredient/inventory page
            window.location.href = "/ingredient";
        }
        else {
            console.log(await response.json());
            Swal.fire("Invalid purchase order!");
        }
    }).catch((e) => {
        console.error(e);
        Swal.fire("Invalid purchase order!");
    })
}

async function renderPurchaseOrderForm(inventoryItem) {
    purchaseOrderFormContainer.innerHTML = '';

    const heading = document.createElement("h1");
    if (inventoryItem) {
        heading.innerText = inventoryItem["Name"];
    }
    else {
        heading.innerText = "Create Purchase Order";
    }
    heading.style.fontWeight = "bold";
    purchaseOrderFormContainer.appendChild(heading);

    // Item label
    const itemLabel = document.createElement("label");
    itemLabel.htmlFor = "itemForm";
    itemLabel.className = "control-label";
    itemLabel.innerText = "Item";
    purchaseOrderFormContainer.appendChild(itemLabel);

    // Item form
    if (inventoryItem) {
        const itemName = document.createElement("input");
        itemName.value = inventoryItem["Name"];
        itemName.id = "inventoryItemInput";
        itemName.className = "form-control";
        itemName.type = "text";
        itemName.readOnly = true;
        itemName.required = true;
        itemName.ariaRequired = "true";
        purchaseOrderFormContainer.appendChild(itemName);
    }
    else {
        const itemNameSelect = document.createElement("select");
        itemNameSelect.className = "form-control";
        itemNameSelect.required = true;
        itemNameSelect.ariaRequired = "true";
        itemNameSelect.id = "inventoryItemInput"

        getInventory().then((result) => {
            result.forEach((inventory) => {
                const inventoryOption = document.createElement('option');
                inventoryOption.id = inventory["InventoryID"];
                inventoryOption.innerText = inventory["Name"];
                if (inventoryItem && inventoryItem["Name"] === inventory["Name"]) {
                    inventoryOption.selected = true;
                }
                itemNameSelect.appendChild(inventoryOption);
            });
        });
        purchaseOrderFormContainer.appendChild(itemNameSelect);
    }

    // Today
    const today = new Date();

    // Date label
    const dateLabel = document.createElement("label");
    dateLabel.htmlFor = "date";
    dateLabel.className = "control-label";
    dateLabel.innerText = "Date of order";
    purchaseOrderFormContainer.appendChild(dateLabel);

    // Date form
    const dateInput = document.createElement("input");
    dateInput.id = "dateInput";
    dateInput.className = "form-control";
    dateInput.required = true;
    dateInput.ariaRequired = "true";
    dateInput.type = "date";
    dateInput.value = today.toISOString().substring(0,10);
    purchaseOrderFormContainer.appendChild(dateInput);

    // Order quantity label
    const orderQuantityLabel = document.createElement('label');
    orderQuantityLabel.htmlFor = "orderQuantityInput";
    orderQuantityLabel.className = "control-label";
    orderQuantityLabel.innerText = "Order Quantity";
    purchaseOrderFormContainer.appendChild(orderQuantityLabel);

    // Order quantity form
    const orderQuantityForm = document.createElement('input');
    orderQuantityForm.className = "form-control";
    orderQuantityForm.id = "orderQuantityInput";
    orderQuantityForm.type = "number";
    orderQuantityForm.min = "1";
    orderQuantityForm.max = "999999999";
    orderQuantityForm.step = "1";
    orderQuantityForm.required = true;
    orderQuantityForm.ariaRequired = "true";
    orderQuantityForm.placeholder = "0";
    purchaseOrderFormContainer.appendChild(orderQuantityForm);

    // Vendor label
    const vendorLabel = document.createElement("label");
    vendorLabel.htmlFor = "vendorInput";
    vendorLabel.className = "control-label";
    vendorLabel.innerText = "Vendor";
    purchaseOrderFormContainer.appendChild(vendorLabel);

    // Vendor form
    const vendorInput = document.createElement("input");
    vendorInput.id = "vendorInput";
    vendorInput.className = "form-control";
    vendorInput.type = "text";
    vendorInput.minLength = 1;
    vendorInput.maxLength = 50;
    vendorInput.required = true;
    vendorInput.ariaRequired = "true";
    vendorInput.placeholder = "Type vendor name...";
    purchaseOrderFormContainer.appendChild(vendorInput);

    // Payable amount label
    const payableAmountLabel = document.createElement("label");
    payableAmountLabel.htmlFor = "payableAmountInput";
    payableAmountLabel.className = "control-label";
    payableAmountLabel.innerText = "Payable Amount";
    purchaseOrderFormContainer.appendChild(payableAmountLabel);

    // Payable amount form
    const payableAmountInput = document.createElement("input");
    payableAmountInput.id = "payableAmountInput";
    payableAmountInput.className = "form-control";
    payableAmountInput.type = "number";
    payableAmountInput.min = "0.00";
    payableAmountInput.max = "999999999.99";
    payableAmountInput.step = "1.00";
    payableAmountInput.required = true;
    payableAmountInput.ariaRequired = "true";
    payableAmountInput.placeholder = "$0.00";
    payableAmountInput.pattern = "\\d+\.\d{0,2}";
    purchaseOrderFormContainer.appendChild(payableAmountInput);

    // Payable date label
    const payableDateLabel = document.createElement('label');
    payableDateLabel.htmlFor = "payableDateInput";
    payableDateLabel.className = "control-label";
    payableDateLabel.innerText = "Payable Date";
    purchaseOrderFormContainer.appendChild(payableDateLabel);

    // Payable date form
    const payableDateInput = document.createElement('input');
    payableDateInput.id = "payableDateInput";
    payableDateInput.className = "form-control";
    payableDateInput.type = "date";
    payableDateInput.value = today.toISOString().substring(0,10);
    payableDateInput.required = true;
    payableDateInput.ariaRequired = "true";
    purchaseOrderFormContainer.appendChild(payableDateInput);

    // Submit button
    const submitButton = document.createElement("button");
    submitButton.id = "submitPurchaseOrderButton";
    submitButton.type = "button";
    submitButton.className = "form-control btn btn-primary col-12 mt-4";
    submitButton.style.width = "50%";
    submitButton.style.marginBottom = "1em";
    submitButton.innerText = "Submit";

    submitButton.addEventListener(
        'mousedown',
        () => {
            const inventoryItemInput = document.getElementById("inventoryItemInput");
            const dateInput = document.getElementById("dateInput");
            const orderQuantityInput = document.getElementById("orderQuantityInput");
            const vendorInput = document.getElementById("vendorInput");
            const payableAmountInput = document.getElementById('payableAmountInput');
            const payableDate = document.getElementById("payableDateInput");

            if (orderQuantityInput.value > 99_999_999.99) {
                Swal.fire("Order quantity too large!");
            }
            else if (orderQuantityInput.value <= 0) {
                Swal.fire("Order quantity too small!");
            }
            else if (!vendorInput.value.match(/^[\w\s.,*/]{0,255}$/)) {
                Swal.fire("Invalid vendor name format!");
            }
            else if (payableAmountInput.value > 99_999_999.99) {
                Swal.fire("Payable amount too large!");
            }
            else if (payableDateInput.value <= 0) {
                Swal.fire("Payable amount too small!");
            }
            else if (inventoryItem) {
                submitPurchaseOrder(
                    inventoryItem["InventoryID"],
                    dateInput,
                    orderQuantityInput,
                    vendorInput,
                    payableAmountInput,
                    payableDate
                );
            }
            else {
                submitPurchaseOrder(
                    inventoryItemInput.options[inventoryItemInput.selectedIndex].id,
                    dateInput,
                    orderQuantityInput,
                    vendorInput,
                    payableAmountInput,
                    payableDate);
            }
        }
    );
    const submitButtonDiv = document.createElement("div");
    submitButtonDiv.id = "submitButtonDiv";
    submitButtonDiv.align = "center";
    submitButtonDiv.appendChild(submitButton);
    purchaseOrderFormContainer.appendChild(submitButtonDiv);

    if (inventoryItem) {
        // Set the title when we are done
        document.title = "Purchase order: " + inventoryItem["Name"];
    }
    else {
        // Set the title when we are done
        document.title = "Create a purchase order";
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
                    await renderPurchaseOrderForm(inventoryItem["content"]);
                }
                else {
                    await renderPurchaseOrderForm();
                }
            }).catch((e) => {
                console.error(e);
                renderPurchaseOrderForm();
            });
        }
        else {
            await renderPurchaseOrderForm();
        }
    }
    else {
        console.log("User is not logged in!");
        // Return to home if the user is not logged in
        window.location.href = "/";
    }
}

const urlParams = new URLSearchParams(window.location.search);
const inventory = urlParams.get("inventory");

getInventoryItem(inventory).then(() => {});