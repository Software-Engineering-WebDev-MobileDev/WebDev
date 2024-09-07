const test = require('unit.js');
const assert = require('assert');

const base_uri = "http://localhost:3000/api",
      test_employee_id = "123456789",
      test_first_name = "Linus",
      test_last_name = "Torvalds",
      test_username = "microsoftbad",
      test_password = "Password123";

describe("Create an account, login, and logout", function () {
    let session_id;

    it("it should create an account and login", async function () {
        // Perform the fetch request to the API
        const response = await fetch(`${base_uri}/create_account`, {
            method: 'POST',
            headers: {
                employee_id: test_employee_id,
                first_name: test_first_name,
                last_name: test_last_name,
                username: test_username,
                password: test_password,
            },
        });

        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201');

        // Parse the response as JSON
        const json_response = await response.json();

        // Test the API response
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success') // Check if 'status' is 'success'
        test
            .bool(json_response.session_id.length === 32)
            .isTrue(); // Ensure the JSON object has 'session_id'

        session_id = json_response.session_id;
    });

    it("it should log the user in", async function () {
        const response = await fetch(`${base_uri}/login`, {
            method: 'POST',
            headers: {
                username: test_username,
                password: test_password,
            },
        });

        // Check that the status code is 201
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201');

        // Parse the response as JSON
        const json_response = await response.json();

        // Test the API response
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success') // Check if 'status' is 'success'
        test
            .bool(json_response.session_id.length === 32)
            .isTrue(); // Ensure the JSON object has 'session_id'

        session_id = json_response.session_id;
    });

    it("it should log the user out", async function () {
        const response = await fetch(`${base_uri}/logout`, {
            method: 'POST',
            headers: {
                session_id: session_id
            },
        });

        // Check that the status code is 200
        assert.strictEqual(response.status, 200, 'Expected HTTP status 200');

        // Parse the response as JSON
        const json_response = await response.json();

        // Test the API response
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success') // Check if 'status' is 'success'
    });
});