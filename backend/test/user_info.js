const test = require('unit.js');
const assert = require('assert');

const base_uri = "http://localhost:3000/api",
    test_employee_id = "01234567890",
    test_first_name = "Richard",
    test_last_name = "Stallman",
    test_username = "freethesoftware",
    test_password = "Password123";
let session_id;

// Make a bunch of test emails
let test_emails = [];
for (let i = 0; i < 5; i++) {
    test_emails.push(`free_software+${i}@gnu.org`);
}
for (let i = 0; i < 5; i++) {
    test_emails.push(`free_software${i}@gnu.com`);
}

// Make a bunch of test phone numbers to make sure the API is permissive of somewhat valid input
const test_phone_inputs = [
    "(1234567890", "(012)3456789", "(901) 2345678", "(890) 123-4567",
    "789-012-3456", "678 901 2345", "5678901234", "456)7890123",
    "345678-9012", "234-4567890"
];
let test_phone_results = [];
for (const input_phone of test_phone_inputs) {
    test_phone_results.push(input_phone.replace(/\D/g, ''));
}

describe("Test user info retrieval", function () {
    it("Add emails for the user", async function () {
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
        // Grab the token
        const json_response = await response.json();
        session_id = json_response["session_id"];

        // Add the emails
        for (const email of test_emails) {
            responses.push(
                await fetch(`${base_uri}/add_user_email`, {
                    method: 'POST',
                    headers: {
                        session_id: session_id,
                        email_address: email,
                        type: "work"
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
        }
    });

    it("Retrieve user's emails as their self", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Get the user's email addresses
        let result_emails = await fetch(`${base_uri}/user_email`, {
            method: 'GET',
            headers: {
                session_id: session_id
            },
        });

        result_emails = await result_emails.json();

        // Make sure that the retrieval is successful
        test
            .object(result_emails) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_emails.status).is('success'); // Check if 'status' is 'success'

        for (const email_entry of result_emails["emails"]) {
            assert.equal(
                test_emails.includes(
                    email_entry["EmailAddress"]),
                true,
                `Email object's address not found in response! (${JSON.stringify(email_entry)})`
            );
        }
    });

    it("Retrieve user's emails as other user", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Get the user's email addresses
        let result_emails = await fetch(`${base_uri}/users_email`, {
            method: 'GET',
            headers: {
                session_id: session_id,
                employee_id: test_employee_id
            },
        });

        result_emails = await result_emails.json();

        // Make sure that the retrieval is successful
        test
            .object(result_emails) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_emails.status).is('success'); // Check if 'status' is 'success'

        for (const email_entry of result_emails["emails"]) {
            assert.equal(
                test_emails.includes(
                    email_entry["EmailAddress"]),
                true,
                `Email object's address not found in response! (${JSON.stringify(email_entry)})`
            );
        }
    });

    it("Delete user's email", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Delete the user's email address
        let result_email = await fetch(`${base_uri}/user_email`, {
            method: 'DELETE',
            headers: {
                session_id: session_id,
                email_address: test_emails[1]
            },
        });

        // Make sure that the deletion is successful
        assert.strictEqual(result_email.status, 200, 'Expected HTTP status 200 for email deletion');
        result_email = await result_email.json();
        test
            .object(result_email) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_email.status).is('success'); // Check if 'status' is 'success'
    });

    it("Add user phone numbers", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Add some phone numbers
        let responses = [];
        for (const phone_number of test_phone_inputs) {
            responses.push(
                await fetch(`${base_uri}/add_user_phone`, {
                    method: 'POST',
                    headers: {
                        session_id: session_id,
                        phone_number: phone_number,
                        type: "work"
                    },
                })
            )
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

    it("Retrieve user's phone numbers as their self", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Get the user's email addresses
        let result_phone_numbers = await fetch(`${base_uri}/user_phone`, {
            method: 'GET',
            headers: {
                session_id: session_id
            },
        });

        result_phone_numbers = await result_phone_numbers.json();

        // Make sure that the retrieval is successful
        test
            .object(result_phone_numbers) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_phone_numbers.status).is('success'); // Check if 'status' is 'success'

        for (const phone_entry of result_phone_numbers["phone_numbers"]) {
            assert.equal(
                test_phone_results.includes(
                    phone_entry["PhoneNumber"]),
                true,
                `Phone object's number not found in response! (${JSON.stringify(phone_entry)})`
            );
        }
    });

    it("Retrieve user's phone numbers as other user", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Get the user's phone numbers
        let result_phone_numbers = await fetch(`${base_uri}/users_phone`, {
            method: 'GET',
            headers: {
                session_id: session_id,
                employee_id: test_employee_id
            },
        });

        result_phone_numbers = await result_phone_numbers.json();

        // Make sure that the retrieval is successful
        test
            .object(result_phone_numbers) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_phone_numbers.status).is('success'); // Check if 'status' is 'success'

        for (const phone_entry of result_phone_numbers["phone_numbers"]) {
            assert.equal(
                test_phone_results.includes(
                    phone_entry["PhoneNumber"]),
                true,
                `Phone object's number not found in response! (${JSON.stringify(phone_entry)})`
            );
        }
    });

    it("Delete user's phone", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Delete the user's email address
        let result_phone = await fetch(`${base_uri}/user_phone`, {
            method: 'DELETE',
            headers: {
                session_id: session_id,
                phone_number: test_phone_inputs[1]
            },
        });

        // Make sure that the deletion is successful
        assert.strictEqual(result_phone.status, 200, 'Expected HTTP status 200 for phone number deletion');
        result_phone = await result_phone.json();
        test
            .object(result_phone) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_phone.status).is('success'); // Check if 'status' is 'success'
    });

    it("Check that the test employee is in the user list", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Test first with defaults
        let result_user_list = await fetch(`${base_uri}/user_list`, {
            method: 'GET',
            headers: {
                session_id: session_id
            },
        });
        result_user_list = await result_user_list.json();

        // Make sure that the retrieval is successful
        test
            .object(result_user_list) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_user_list.status).is('success'); // Check if 'status' is 'success'

        assert.strictEqual(result_user_list.page, 1, "Response page invalid");
        assert.strictEqual(result_user_list.content.length <= 20, true, "Response too long");
        assert.equal(
            JSON.stringify(result_user_list["content"].find(
                e => e["EmployeeID"] === test_employee_id && e["FirstName"] === test_first_name && e["LastName"] === test_last_name && e["Username"] === test_username
            )),
            JSON.stringify({
                EmployeeID: "01234567890",
                FirstName: "Richard",
                LastName: "Stallman",
                Username: "freethesoftware"
            }),
            //"Expected employee not found"
        );

        // Then test with provided pagination parameters
        result_user_list = await fetch(`${base_uri}/user_list`, {
            method: 'GET',
            headers: {
                session_id: session_id,
                page: "1",
                page_size: "12"
            },
        });
        result_user_list = await result_user_list.json();

        // Make sure that the retrieval is successful
        test
            .object(result_user_list) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(result_user_list.status).is('success'); // Check if 'status' is 'success'

        assert.strictEqual(result_user_list.page, 1, "Response page invalid");
        assert.strictEqual(result_user_list.content.length <= 12, true, "Response too long");
    });
    it("Get an employee's info", async function () {
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

        // Make sure that the login was successful
        assert.strictEqual(response.status, 201, 'Expected HTTP status 201 for user login');
        test
            .object(json_response) // Ensure it's an object
            .hasProperty('status') // Check if 'status' exists
            .string(json_response.status).is('success'); // Check if 'status' is 'success'

        // Get the user's info
        let user_info = await fetch(`${base_uri}/my_info`, {
            method: 'GET',
            headers: {
                session_id: session_id
            },
        });

        // Check that the status code is 200
        assert.strictEqual(user_info.status, 200, `Expected HTTP status 200 (OK)`);

        // Make it JSON
        user_info = await user_info.json();

        test
            .object(user_info)                      // Ensure it's an object
            .hasProperty('status')                  // Check if 'status' exists
            .hasProperty('content')                 // Check that it has a content field
            .string(user_info.status).is('success'); // Check if 'status' is 'success'

        assert.strictEqual(
            typeof user_info["content"],
            "object",
            "Expected user_info.content to be an object"
        );

        // Make sure that user_info.content has all the correct fields
        test
            .object(user_info["content"])
            .hasProperty('EmployeeID')
            .hasProperty('FirstName')
            .hasProperty('LastName')
            .hasProperty('Username')
            .hasProperty('RoleName')
            .hasProperty('RoleDescription')
            .hasProperty('EmploymentStatus')
            .hasProperty('StartDate')
            .hasProperty('EndDate')
            .hasProperty('Emails')
            .hasProperty('PhoneNumbers');

        assert.strictEqual(
            user_info["content"]["Emails"] instanceof Array,
            true,
            "Expected `Emails` to be an array"
        );
        assert.strictEqual(
            user_info["content"]["PhoneNumbers"] instanceof Array,
            true,
            "Expected `PhoneNumbers` to be an array"
        );
    });
});
