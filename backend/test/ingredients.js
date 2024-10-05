const test = require('unit.js');
const assert = require('assert');

// Database setup:
process.env.NODE_ENV = "development";
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

const test_ingredients = [
    {
        description: "Flour",
        category: "Baking",
        measurement: "kg",
        max_amount: 100.00,
        reorder_amount: 20.00,
        min_amount: 5.00
    },
    {
        description: "Sugar",
        category: "Baking",
        measurement: "kg",
        max_amount: 50.00,
        reorder_amount: 10.00,
        min_amount: 2.00
    },
    {
        description: "Salt",
        category: "Seasoning",
        measurement: "g",
        max_amount: 5000.00,
        reorder_amount: 500.00,
        min_amount: 100.00
    },
    {
        description: "Butter",
        category: "Dairy",
        measurement: "kg",
        max_amount: 30.00,
        reorder_amount: 5.00,
        min_amount: 1.00
    },
    {
        description: "Milk",
        category: "Dairy",
        measurement: "L",
        max_amount: 200.00,
        reorder_amount: 50.00,
        min_amount: 10.00
    },
    {
        description: "Eggs",
        category: "Dairy",
        measurement: "units",
        max_amount: 500.00,
        reorder_amount: 100.00,
        min_amount: 20.00
    },
    {
        description: "Baking Powder",
        category: "Baking",
        measurement: "g",
        max_amount: 1000.00,
        reorder_amount: 200.00,
        min_amount: 50.00
    },
    {
        description: "Vanilla Extract",
        category: "Flavoring",
        measurement: "mL",
        max_amount: 500.00,
        reorder_amount: 100.00,
        min_amount: 20.00
    },
    {
        description: "Yeast",
        category: "Baking",
        measurement: "g",
        max_amount: 2000.00,
        reorder_amount: 500.00,
        min_amount: 100.00
    },
    {
        description: "Chocolate Chips",
        category: "Confectionery",
        measurement: "kg",
        max_amount: 50.00,
        reorder_amount: 10.00,
        min_amount: 2.00
    }
];

const test_ingredient_strings = test_ingredients.map(
    ingredient => JSON.stringify({
        Name: ingredient.description,
        Quantity: 10.0,
        UnitOfMeasure: ingredient.measurement,
        ShelfLife: 1,
        ShelfLifeUnit: 'day',
        ReorderAmount: 10.00,
        ReorderUnit: 'kg',
    })
);
const test_ingredient_strings_short = test_ingredients.map(
    ingredient => JSON.stringify({
        Name: ingredient.description,
        Quantity: 10.0,
        UnitOfMeasure: ingredient.measurement
    })
);

const base_uri = "http://localhost:3000/api",
    test_employee_id = "01234567890",
    test_first_name = "Richard",
    test_last_name = "Stallman",
    test_username = "freethesoftware",
    test_password = "Password123";
let session_id;

let test_uuid;

describe("Create and retrieve ingredients", function () {
    before(async function () {
        for (const ingredient of test_ingredients) {
            test_uuid = database.gen_uuid();
            await database.executeQuery(
                `INSERT INTO tblInventory (InventoryID, Name, ShelfLife, ShelfLifeUnit, ReorderAmount, ReorderUnit)
                 VALUES ('${test_uuid}', '${ingredient.description}', 1, 'day', ${ingredient.reorder_amount},
                         '${ingredient.measurement}')`
            )
        }
    });
    it("Add some ingredients", async function () {
        let responses = [];

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
        // Login to get a fresh token
        const response = await fetch(`${base_uri}/login`, {
            method: 'POST',
            headers: {
                username: test_username,
                password: test_password,
            },
        });
        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201');
        // Grab the token
        const json_response = await response.json();
        session_id = json_response["session_id"];

        // Add the test ingredients
        for (const ingredient of test_ingredients) {
            responses.push(
                await fetch(`${base_uri}/ingredient`,
                    {
                        method: "POST",
                        headers: {
                            session_id: session_id,
                            //description: ingredient.description,
                            inventory_id: test_uuid,
                            quantity: 10.0,
                            unit_of_measurement: ingredient.measurement,
                            // max_amount: ingredient.max_amount,
                            // reorder_amount: ingredient.reorder_amount,
                            // min_amount: ingredient.min_amount
                        }
                    }
                )
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
        }
    });

    it("Retrieve all ingredients", async function () {
        // Login to get a fresh token
        const response = await fetch(`${base_uri}/login`, {
            method: 'POST',
            headers: {
                username: test_username,
                password: test_password,
            },
        });
        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201');
        // Grab the token
        const json_response = await response.json();
        session_id = json_response["session_id"];

        /*
         * Test the long form of the ingredient list
         */

        // Grab the ingredients
        let ingredient_list = await fetch(`${base_uri}/ingredients`,
            {
                method: "GET",
                headers: {
                    session_id: session_id
                }
            }
        );

        // Check that the status code is 200
        assert.strictEqual(ingredient_list.status, 200, 'Expected HTTP status 200 (OK)');

        // Make it JSON
        ingredient_list = await ingredient_list.json();

        // Test the API response
        test
            .object(ingredient_list) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(ingredient_list.status).is('success'); // Check if 'status' is 'success'

        for (const ingredient of ingredient_list["content"]) {
            let ingredient_string = JSON.stringify(
                {
                    Name: ingredient["Name"],
                    Quantity: ingredient["Quantity"],
                    UnitOfMeasure: 'kg', // ingredient["UnitOfMeasure"],
                    ShelfLife: 1,
                    ShelfLifeUnit: 'day',
                    ReorderAmount: 10.00,
                    ReorderUnit: 'kg'
                }
            );
            assert.strictEqual(
                test_ingredient_strings.includes(ingredient_string),
                true,
                `Expected ingredient list to include ingredient: ${JSON.stringify(ingredient)}\n${ingredient_string}`
            );
        }

        /*
         * Test the short form of the ingredient list
         */

        // Grab the ingredients
        ingredient_list = await fetch(`${base_uri}/ingredients_short`,
            {
                method: "GET",
                headers: {
                    session_id: session_id
                }
            }
        );

        // Check that the status code is 200
        assert.strictEqual(ingredient_list.status, 200, 'Expected HTTP status 200 (OK)');

        // Make it JSON
        ingredient_list = await ingredient_list.json();

        // Test the API response
        test
            .object(ingredient_list) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(ingredient_list.status).is('success'); // Check if 'status' is 'success'

        for (const ingredient of ingredient_list["content"]) {
            let ingredient_string = JSON.stringify(
                {
                    Name: ingredient["Name"],
                    Quantity: ingredient["Quantity"],
                    UnitOfMeasure: 'kg', // ingredient["UnitOfMeasure"],
                }
            );
            assert.strictEqual(
                test_ingredient_strings_short.includes(ingredient_string),
                true,
                `Expected (short) ingredient list to include ingredient ${ingredient}`
            );
        }
    });

    it("Get an ingredient from the database then retrieve it from the API by ID", async function () {
        // Login to get a fresh token
        const response = await fetch(`${base_uri}/login`, {
            method: 'POST',
            headers: {
                username: test_username,
                password: test_password,
            },
        });
        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201');
        // Grab the token
        const json_response = await response.json();
        session_id = json_response["session_id"];

        const test_ingredient_object = await database.executeQuery(
            `SELECT *
             FROM tblIngredients`
        ).then((result) => {
            return result.recordsets[0][0];
        });

        let ingredient_api = await fetch(`${base_uri}/ingredient`,
            {
                method: "GET",
                headers: {
                    session_id: session_id,
                    ingredient_id: test_ingredient_object["IngredientID"]
                }
            }
        );

        ingredient_api = await ingredient_api.json();
        // Make sure that the retrieval is successful
        test
            .object(ingredient_api) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(ingredient_api.status).is('success'); // Check if 'status' is 'success'

        assert.strictEqual(JSON.stringify(ingredient_api["content"]), JSON.stringify(test_ingredient_object), `Database and API ingredients do not match:\n${test_ingredient_object}\n\n${ingredient_api}`)
    });

    it("Get an ingredient from the database then delete it using the API", async function () {
        // Login to get a fresh token
        const response = await fetch(`${base_uri}/login`, {
            method: 'POST',
            headers: {
                username: test_username,
                password: test_password,
            },
        });
        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201');
        // Grab the token
        const json_response = await response.json();
        session_id = json_response["session_id"];

        const test_ingredient_object = await database.executeQuery(
            `SELECT *
             FROM tblIngredients`
        ).then((result) => {
            return result.recordsets[0][0];
        });

        let ingredient_api = await fetch(`${base_uri}/ingredient`,
            {
                method: "DELETE",
                headers: {
                    session_id: session_id,
                    ingredient_id: test_ingredient_object["IngredientID"]
                }
            }
        );

        ingredient_api = await ingredient_api.json();
        // Make sure that the deletion is successful
        test
            .object(ingredient_api) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(ingredient_api.status).is('success'); // Check if 'status' is 'success'

        // Check the database for the ingredient
        const database_ingredient_check = await database.executeQuery(
            `SELECT *
             FROM tblIngredients
             WHERE IngredientID = '${test_ingredient_object["IngredientID"]}'`
        ).then((result) => {
            return result;
        })

        // `rowsAffected === 0` means we found nothing in the database and are therefore successful
        assert.strictEqual(
            database_ingredient_check.rowsAffected[0],
            0,
            `Ingredient not deleted from the actual database!`
        );
    });
});
