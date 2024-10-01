const test = require('unit.js');
const assert = require('assert');

// Database setup:
process.env.NODE_ENV = "development";
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

const base_uri = "http://localhost:3000/api",
    test_employee_id = "00123456789",
    test_first_name = "Denis",
    test_last_name = "Ritchie",
    test_username = "programinc",
    test_password = "Password123";
let session_id;

const test_ingredients = [
    {
        name: "flour",
        shelf_life: 365,           // 1 year
        shelf_life_unit: "days",
        reorder_amount: 50.00,      // Reorder 50 kg of flour
        reorder_unit: "kg"
    },
    {
        name: "sugar",
        shelf_life: 730,           // 2 years
        shelf_life_unit: "days",
        reorder_amount: 30.00,      // Reorder 30 kg of sugar
        reorder_unit: "kg"
    },
    {
        name: "butter",
        shelf_life: 180,           // 6 months
        shelf_life_unit: "days",
        reorder_amount: 20.00,      // Reorder 20 kg of butter
        reorder_unit: "kg"
    },
    {
        name: "eggs",
        shelf_life: 30,            // 1 month
        shelf_life_unit: "days",
        reorder_amount: 100.00,     // Reorder 100 eggs
        reorder_unit: "pieces"
    },
    {
        name: "baking powder",
        shelf_life: 365,           // 1 year
        shelf_life_unit: "days",
        reorder_amount: 10.00,      // Reorder 10 kg of baking powder
        reorder_unit: "kg"
    },
    {
        name: "vanilla extract",
        shelf_life: 730,           // 2 years
        shelf_life_unit: "days",
        reorder_amount: 5.00,       // Reorder 5 liters of vanilla extract
        reorder_unit: "liters"
    },
    {
        name: "yeast",
        shelf_life: 180,           // 6 months
        shelf_life_unit: "days",
        reorder_amount: 2.00,       // Reorder 2 kg of yeast
        reorder_unit: "kg"
    },
    {
        name: "milk",
        shelf_life: 7,             // 1 week
        shelf_life_unit: "days",
        reorder_amount: 50.00,      // Reorder 50 liters of milk
        reorder_unit: "liters"
    },
    {
        name: "salt",
        shelf_life: 1095,          // 3 years
        shelf_life_unit: "days",
        reorder_amount: 5.00,       // Reorder 5 kg of salt
        reorder_unit: "kg"
    },
    {
        name: "cocoa powder",
        shelf_life: 730,           // 2 years
        shelf_life_unit: "days",
        reorder_amount: 15.00,      // Reorder 15 kg of cocoa powder
        reorder_unit: "kg"
    }
];

const test_ingredient_strings = test_ingredients.map(
    ingredient => JSON.stringify({
        Name: ingredient.name,
        ShelfLife: ingredient.shelf_life,
        ShelfLifeUnit: ingredient.shelf_life_unit,
        ReorderAmount: ingredient.reorder_amount,
        ReorderUnit: ingredient.reorder_unit
    })
);
const test_ingredient_strings_short = test_ingredients.map(
    ingredient => JSON.stringify({
        Name: ingredient.name,
        Quantity: 10.0,
        UnitOfMeasure: ingredient.measurement
    })
);

describe("Test inventory management endpoints", function () {
    before(async function () {
        // Make sure the account exists (what this returns is irrelevant)
        await fetch(`${base_uri}/create_account`, {
            method: 'POST',
            headers: {
                employee_id: test_employee_id,
                first_name: test_first_name,
                last_name: test_last_name,
                username: test_username,
                password: test_password,
            },
        });
        await database.executeQuery(
            `UPDATE tblUsers
             SET RoleID = '1'
             WHERE EmployeeID = '${test_employee_id}'`
        );
        // Login to get a fresh token
        const response = await fetch(`${base_uri}/login`, {
            method: 'POST',
            headers: {
                username: test_username,
                password: test_password,
            },
        });
        // Grab the token
        const json_response = await response.json();
        session_id = json_response["session_id"];
    });
    it("Add ingredients to the database", async function () {
        this.timeout(10_000);
        // POST responses
        let responses = [];

        // Add the ingredients
        for (const ingredient of test_ingredients) {
            responses.push(
                await fetch(`${base_uri}/inventory_item`, {
                    method: 'POST',
                    headers: {
                        session_id: session_id,
                        name: ingredient.name,
                        shelf_life: ingredient.shelf_life,
                        shelf_life_unit: ingredient.shelf_life_unit,
                        reorder_amount: ingredient.reorder_amount,
                        reorder_unit: ingredient.reorder_unit
                    },
                })
            );
        }

        // Make sure that everything came back right
        for (const response of responses) {
            // Check that the status code is 201
            assert.strictEqual(response.status, 201, 'Expected HTTP status 201 (Created)');

            // Make sure that the status is correct
            const response_json = await response.json();
            test
                .object(response_json) // Ensure it's an object
                .hasProperty('status') // Check if 'status' exists
                .string(response_json.status).is('success'); // Check if 'status' is 'success'

            // Make sure that the inventory_id is returned
            test
                .object(response_json)          // Ensure it's an object
                .hasProperty('inventory_id');   // Make sure that it has `inventory_id`

            // Make sure that the inventory_id is the correct format
            assert.strictEqual(
                /^\w{0,32}$/.test(response_json['inventory_id']),
                true,
                `inventory_id format invalid in response. Value: ${response_json['inventory_id']}`
            );
        }
    });

    it("Add an ingredient to the database without shelf life", async function () {
        // Grab the first one for testing.
        let inventory_item = test_ingredients[0];

        // Remove shelf life attributes
        delete inventory_item.shelf_life;
        delete inventory_item.shelf_life_unit;

        let response = await fetch(`${base_uri}/inventory_item`, {
            method: 'POST',
            headers: {
                session_id: session_id,
                name: inventory_item.name,
                reorder_amount: inventory_item.reorder_amount,
                reorder_unit: inventory_item.reorder_unit
            },
        });

        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 (CREATED)');

        response = await response.json();
        // Cleanup the database for later tests
        await database.executeQuery(
            `DELETE
             FROM tblInventory
             WHERE InventoryID = '${response['inventory_id']}'`
        );
    });

    it("Get ingredients from the inventory", async function () {
        // Grab the inventory list
        let inventory_list = await fetch(`${base_uri}/inventory`,
            {
                method: "GET",
                headers: {
                    session_id: session_id
                }
            }
        );

        // Check that the status code is 200
        assert.strictEqual(inventory_list.status, 200, 'Expected HTTP status 200 (OK)');

        // Make it JSON
        inventory_list = await inventory_list.json();

        // Test the API response
        test
            .object(inventory_list) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(inventory_list.status).is('success'); // Check if 'status' is 'success'

        test
            .number(inventory_list['content'].length)
            .isGreaterThan(1)

        for (const inventory_item of inventory_list["content"]) {
            let inventory_item_string = JSON.stringify(
                {
                    Name: inventory_item.Name,
                    ShelfLife: inventory_item.ShelfLife,
                    ShelfLifeUnit: inventory_item.ShelfLifeUnit,
                    ReorderAmount: inventory_item.ReorderAmount,
                    ReorderUnit: inventory_item.ReorderUnit
                }
            );
            assert.strictEqual(
                test_ingredient_strings.includes(inventory_item_string),
                true,
                `Expected ingredient list to include ingredient: ${JSON.stringify(inventory_item)}\n${inventory_item_string}`
            );
        }
    });

    it("Get two ingredients from the inventory", async function () {
        // Grab the inventory list
        let inventory_list = await fetch(`${base_uri}/inventory`,
            {
                method: "GET",
                headers: {
                    session_id: session_id,
                    page: 2,
                    page_size: 2
                }
            }
        );

        // Check that the status code is 200
        assert.strictEqual(inventory_list.status, 200, 'Expected HTTP status 200 (OK)');

        // Make it JSON
        inventory_list = await inventory_list.json();

        // Test the API response
        test
            .object(inventory_list) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(inventory_list.status).is('success'); // Check if 'status' is 'success'

        assert.strictEqual(inventory_list['content'].length, 2, "Pagination with page_size 2 and page 2 should yield a list of two ingredient objects.")

        for (const inventory_item of inventory_list["content"]) {
            let inventory_item_string = JSON.stringify(
                {
                    Name: inventory_item.Name,
                    ShelfLife: inventory_item.ShelfLife,
                    ShelfLifeUnit: inventory_item.ShelfLifeUnit,
                    ReorderAmount: inventory_item.ReorderAmount,
                    ReorderUnit: inventory_item.ReorderUnit
                }
            );
            assert.strictEqual(
                test_ingredient_strings.includes(inventory_item_string),
                true,
                `Expected ingredient list to include ingredient: ${JSON.stringify(inventory_item)}\n${inventory_item_string}`
            );
        }
    });

    it("Get an inventory item from the API", async function () {
        // Grab an inventory item from the database for testing purposes
        let item = await database.executeQuery(
            `SELECT *
             FROM tblInventory`
        ).then((result) => {
            return result.recordsets[0][0]
        });
        const inventory_id = item["InventoryID"];

        // Grab the same item from the API to test
        let inventory_item = await fetch(`${base_uri}/inventory_item`,
            {
                method: "GET",
                headers: {
                    session_id: session_id,
                    inventory_id: inventory_id
                }
            }
        );

        // Check that the status code is 200
        assert.strictEqual(inventory_item.status, 200, 'Expected HTTP status 200 (OK)');

        // Make it JSON
        inventory_item = await inventory_item.json();

        // Make sure that the status is correct
        test
            .object(inventory_item) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(inventory_item.status).is('success'); // Check if 'status' is 'success'

        // Make sure that the items are the same
        assert.strictEqual(JSON.stringify(inventory_item["content"]), JSON.stringify(item), `Expected database and API inventory items to be the same!`)
    });

    it("Update an item in the inventory", async function () {
        this.timeout(10_000);
        // Grab the first one for testing.
        let inventory_item = test_ingredients[1];

        let response = await fetch(`${base_uri}/inventory_item`, {
            method: 'POST',
            headers: {
                session_id: session_id,
                name: inventory_item.name,
                reorder_amount: inventory_item.reorder_amount,
                reorder_unit: inventory_item.reorder_unit
            },
        });

        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 (CREATED)');
        response = await response.json();

        // Make sure that the status is correct
        test
            .object(response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(response.status).is('success'); // Check if 'status' is 'success'

        const inventory_id = response["inventory_id"];

        /*
         * Oh no! We forgot to add the shelf life to this inventory item!
         * Let's fix that, shall we?
         */
        response = await fetch(`${base_uri}/inventory_item`, {
            method: 'PUT',
            headers: {
                session_id: session_id,
                inventory_id: inventory_id,
                name: inventory_item.name,
                shelf_life: inventory_item.shelf_life,
                shelf_life_unit: inventory_item.shelf_life_unit,
                reorder_amount: inventory_item.reorder_amount,
                reorder_unit: inventory_item.reorder_unit
            },
        });

        // Check that the status code is 200
        // I don't know why, but this is randomly 400 for no apparent reason.
        assert.strictEqual(response.status, 200, `Expected HTTP status 200 (OK)`);

        // Make sure that the status is correct
        response = await response.json();
        test
            .object(response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(response.status).is('success'); // Check if 'status' is 'success'

        /*
         * Wait, this was supposed to be bricks.
         * Last I checked, bricks don't have a relevant expiration date.
         */
        response = await fetch(`${base_uri}/inventory_item`, {
            method: 'PUT',
            headers: {
                session_id: session_id,
                inventory_id: inventory_id,
                name: "Bricks",
                reorder_amount: 20.00,
                reorder_unit: "count"
            },
        });

        // Check that the status code is 200
        assert.strictEqual(response.status, 200, 'Expected HTTP status 200 (OK)');

        // Make sure that the status is correct
        response = await response.json();
        test
            .object(response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(response.status).is('success'); // Check if 'status' is 'success'

        let database_version = await database.executeQuery(
            `SELECT Name, ShelfLife, ShelfLifeUnit, ReorderAmount, ReorderUnit
             FROM tblInventory
             WHERE InventoryID = '${inventory_id}'`
        ).then((response) => {
            return response.recordset[0];
        });

        assert.strictEqual(
            database_version["Name"],
            "Bricks",
            "Database version is not \"Bricks\""
        );
        assert.strictEqual(
            database_version["ShelfLife"],
            null,
            `Database version shelf life is not null. Instead got ${database_version["ShelfLife"]}`
        );
        assert.strictEqual(
            database_version["ShelfLifeUnit"],
            null,
            `Database version shelf life is not null. Instead got ${database_version["ShelfLife"]}`
        );
        assert.strictEqual(
            database_version["ReorderAmount"],
            20,
            "Database version reorder amount is not 20 bricks."
        );
        assert.strictEqual(
            database_version["ReorderUnit"],
            "count",
            "Database version reorder unit is not count."
        );

        // Cleanup the database for later tests
        await database.executeQuery(
            `DELETE
             FROM tblInventory
             WHERE InventoryID = '${inventory_id}'`
        );
    });

    it("Try to delete an item from the inventory", async function () {
        // Get an inventory id from the database to use for testing
        const inventory_id = await database.executeQuery(
            `SELECT InventoryID
             FROM tblInventory`
        ).then((result) => {
            return result.recordsets[0][0]["InventoryID"];
        });

        let response = await fetch(`${base_uri}/inventory_item`, {
            method: 'DELETE',
            headers: {
                session_id: session_id,
                inventory_id: inventory_id
            },
        });

        // Check that the status code is 200
        assert.strictEqual(response.status, 200, 'Expected HTTP status 200 (OK)');

        // Make sure that the status is correct
        response = await response.json();
        test
            .object(response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(response.status).is('success'); // Check if 'status' is 'success'

        const missing_inventory_id = await database.executeQuery(
            `SELECT InventoryID
             FROM tblInventory
             WHERE InventoryID = '${inventory_id}'`
        ).then((result) => {
            return result.rowsAffected[0];
        });

        assert.strictEqual(
            missing_inventory_id,
            0,
            `Inventory item not deleted from the database: ${inventory_id}`
        );
    });
});

describe("Test inventory amount change endpoints", function () {
    before(async function () {
        // Make sure the account exists (what this returns is irrelevant)
        await fetch(`${base_uri}/create_account`, {
            method: 'POST',
            headers: {
                employee_id: test_employee_id,
                first_name: test_first_name,
                last_name: test_last_name,
                username: test_username,
                password: test_password,
            },
        });
        /*
         * For these tests, the user is not required to be a manager.
         * Therefore, we'll just not make them a manager.
         */

        // Login to get a fresh token
        const response = await fetch(`${base_uri}/login`, {
            method: 'POST',
            headers: {
                username: test_username,
                password: test_password,
            },
        });
        // Grab the token
        const json_response = await response.json();
        session_id = json_response["session_id"];
    });
    it("Add some changes to the inventory history", async function () {
        this.timeout(10_000);
        // Get an inventory id to use for subsequent testing of endpoints.
        let inventory_id = await database.executeQuery(
            `SELECT InventoryID
             FROM tblInventory
             WHERE Name = 'vanilla extract'`
        ).then((result) => {
            return result.recordsets[0][0]["InventoryID"]
        });

        // For use in relevant queries
        const date = new Date();

        // We'll try a few things with this endpoint and then check them later
        let responses = [];

        // Query with everything defined
        responses.push(
            await fetch(`${base_uri}/inventory_change`, {
                method: 'POST',
                headers: {
                    session_id: session_id,
                    change_amount: 20.0,
                    inventory_id: inventory_id,
                    description: "Made a purchase or something",
                    expiration_date: date.toISOString()
                },
            })
        );

        // We shouldn't *need* an expiration date on vanilla extract, right?
        responses.push(
            await fetch(`${base_uri}/inventory_change`, {
                method: 'POST',
                headers: {
                    session_id: session_id,
                    change_amount: -20.0,
                    inventory_id: inventory_id,
                    description: "Used all the vanilla extract to make a singular load of bread",
                },
            })
        );

        /*
         * Make sure that we can just throw the bare minimum at the API and it works.
         * Employees are lazy, after all, right?
         */
        responses.push(
            await fetch(`${base_uri}/inventory_change`, {
                method: 'POST',
                headers: {
                    session_id: session_id,
                    change_amount: 20.0,
                    inventory_id: inventory_id
                },
            })
        );

        // Make sure that everything came back right
        for (const response of responses) {
            // Check that the status code is 201
            assert.strictEqual(response.status, 201, 'Expected HTTP status 201 (Created)');

            // Make sure that the status is correct
            const response_json = await response.json();
            test
                .object(response_json) // Ensure it's an object
                .hasProperty('status') // Check if 'status' exists
                .string(response_json.status).is('success'); // Check if 'status' is 'success'

            // Make sure that the hist_id is returned
            test
                .object(response_json)      // Ensure it's an object
                .hasProperty('hist_id');    // Make sure that it has `inventory_id`

            // Make sure that the hist_id is the correct format
            assert.strictEqual(
                /^\w{0,32}$/.test(response_json['hist_id']),
                true,
                `hist_id format invalid in response. Value: ${response_json['hist_id']}`
            );
        }
    });

    it("Get inventory amounts", async function () {
        // this.isGoingToTakeAWhile
        this.timeout(10_000);

        // Get inventory ids to use for subsequent testing of endpoints.
        let inventory_ids = await database.executeQuery(
            `SELECT InventoryID
             FROM tblInventory
             WHERE Name <> 'vanilla extract'`
        ).then((result) => {
            // Get the result records
            let result_list = result.recordsets[0];

            // Extract only the InventoryID as only the string itself
            result_list = result_list.map((record) =>
                record["InventoryID"]
            );
            return result_list;
        });

        // The List of database promises to be resolved later
        let hist_promises = [];

        // Add some data to the database to be retrieved.
        for (const inventory_id of inventory_ids) {
            // Hold on to the promise to be resolved later for the sake of speed
            hist_promises.push(database.executeQuery(
                `INSERT INTO tblInventoryHistory
                 VALUES ('${database.gen_uuid()}', 20.00, '${test_employee_id}', '${inventory_id}', NULL, GETDATE(),
                         NULL)`
            ));
        }

        // Await all the promises from before so that we know the data is in the database
        for (const prom of hist_promises) {
            await prom;
        }

        // Retrieve the amounts
        let inventory_amounts = await fetch(`${base_uri}/inventory_amount`, {
            method: 'GET',
            headers: {
                session_id: session_id,
                page: 1,
                page_size: 30
            },
        });

        // Check that the status code is 200
        assert.strictEqual(inventory_amounts.status, 200, `Expected HTTP status 200 (OK)`);

        // Make sure that the status is correct
        const response_json = await inventory_amounts.json();
        test
            .object(response_json) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(response_json.status).is('success'); // Check if 'status' is 'success'

        // Make sure that the response has all the correct properties
        for (const inventory_item of response_json["content"]) {
            test
                .object(inventory_item)
                .hasProperty("InventoryID");
            test
                .object(inventory_item)
                .hasProperty("Name");
            test
                .object(inventory_item)
                .hasProperty("Amount");
            test
                .object(inventory_item)
                .hasProperty("ShelfLife");
            test
                .object(inventory_item)
                .hasProperty("ShelfLifeUnit");
            test
                .object(inventory_item)
                .hasProperty("ReorderAmount");
            test
                .object(inventory_item)
                .hasProperty("ReorderUnit");
            assert.strictEqual(
                inventory_item["Amount"] >= 20,
                true,
                `Expected inventory item amount to be >= 20 but got ${inventory_item["Amount"]}`
            )
        }
    });

    it("Get inventory changes, but not amounts", async function () {
        this.timeout(10_000);

        // Retrieve the amounts
        let inventory_history = await fetch(`${base_uri}/inventory_change`, {
            method: 'GET',
            headers: {
                session_id: session_id,
                page: 1,
                page_size: 30
            },
        });

        // Check that the status code is 200
        assert.strictEqual(inventory_history.status, 200, `Expected HTTP status 200 (OK)`);

        // Make sure that the status is correct
        const response_json = await inventory_history.json();
        test
            .object(response_json)                      // Ensure it's an object
            .hasProperty('status')                      // Check if 'status' exists
            .string(response_json.status).is('success') // Check if 'status' is 'success'
            .number(response_json.page).is(1)           // Check that the page is correct
            .number(response_json.page_count);          // Make sure we have a page count as well

        // Make sure that the response has all the correct properties.
        for (const history_entry of response_json["content"]) {
            test
                .object(history_entry)
                .hasProperty("InventoryID");
            test
                .object(history_entry)
                .hasProperty("Name");
            test
                .object(history_entry)
                .hasProperty("ShelfLife");
            test
                .object(history_entry)
                .hasProperty("ShelfLifeUnit");
            test
                .object(history_entry)
                .hasProperty("ReorderAmount");
            test
                .object(history_entry)
                .hasProperty("ReorderUnit");
            test
                .object(history_entry)
                .hasProperty("HistID");
            test
                .object(history_entry)
                .hasProperty("ChangeAmount");
            test
                .object(history_entry)
                .hasProperty("EmployeeID");
            test
                .object(history_entry)
                .hasProperty("Description");
            test
                .object(history_entry)
                .hasProperty("Date");
            test
                .object(history_entry)
                .hasProperty("ExpirationDate");
        }
    });

    it("Get an inventory change item and delete it", async function () {
        this.timeout(10_000);

        // Get an inventory id to use for subsequent testing
        let hist_id = await database.executeQuery(
            `SELECT HistID
             FROM tblInventoryHistory
             WHERE InventoryID NOT IN (SELECT InventoryID
                                       FROM tblInventory
                                       WHERE Name <> 'vanilla extract')`
        ).then((result) => {
            return result.recordsets[0][0]["HistID"]
        });

        // Delete the inventory change log from the history
        let response = await fetch(`${base_uri}/inventory_change`, {
            method: 'DELETE',
            headers: {
                session_id: session_id,
                hist_id: hist_id
            },
        });

        // Check that the status code is 200
        assert.strictEqual(response.status, 200, `Expected HTTP status 200 (OK)`);

        // Make sure that the status is correct
        const response_json = await response.json();
        test
            .object(response_json)                      // Ensure it's an object
            .hasProperty('status')                      // Check if 'status' exists
            .string(response_json.status).is('success') // Check if 'status' is 'success'

        // Check the database for the item that should have been deleted
        await database.executeQuery(
            `SELECT * FROM tblInventoryHistory WHERE HistID = '${hist_id}'`
        ).then((result) => {
            // rowsAffected[0] should be 0 if the item was removed from the database
            assert.strictEqual(
                result.rowsAffected[0],
                0,
                "History item not removed from tblInventoryHistory"
            );
        });
    });
});
