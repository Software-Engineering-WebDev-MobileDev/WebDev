# CSC 4610 Project API

Routes

## Create Account (POST)

`/api/create_account`

### Arguments:

(headers)

employee_id (str): The employee ID

first_name (str): User's first name

last_name (str): User's last name

username (str): username

password (str): password

### Example

Query:

```
base_uri/api/create_account
```

```js 
await fetch("base_uri/api/create_account",
    {
        method: "POST",
        headers: {
            employee_id: test_employee_id,
            first_name: test_first_name,
            last_name: test_last_name,
            username: test_username,
            password: test_password,
        },
    })
    .then((result) => {
        console.log(result);
        return result;
    })
    .catch((e) => {
        console.log(e);
        return e;
    });
```

Response:

```json
{
  "status": "success",
  "session_id": "<session_id>"
}
```

## Login (POST)

`/api/login`

### Arguments:

(headers)

username (str): username

password (str): password

### Example

Query:

```
base_uri/api/login
```

```js 
await fetch("base_uri/api/login",
    {
        method: "POST",
        headers: {
            username: "user",
            password: "password",
        },
    })
    .then((result) => {
        console.log(result);
        return result;
    })
    .catch((e) => {
        console.log(e);
        return e;
    });
```

Response:

```json
{
  "status": "success",
  "session_id": "<session_id>"
}
```

## Logout (POST)

`/api/logout`

### Arguments:

(headers)

session_id (str): the session id to logout.

Query:

```
base_uri/api/logout
```

```js 
await fetch("base_uri/api/logout", 
    {
        method: "POST",
        headers: {
            session_id: "<session_id>"
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success"
}
```

## Token Bump (POST)

`/api/token_bump`

### Arguments:

(headers)

session_id (str): the session id to update and check

Query:

```
base_uri/api/token_bump
```

```js 
await fetch("base_uri/api/token_bump", 
    {
        method: "POST",
        headers: {
            session_id: "<session_id>"
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## User's own email addresses (GET)

`/api/user_email`

### Arguments:

(headers)

session_id (str): the session id to use

Query:

```
base_uri/api/user_email
```

```js 
await fetch(`base_uri/api/user_email`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success",
  "emails": [
    {
      "EmailID": "035db203029f46b484f84f4214822e3a",
      "EmailAddress": "free_software2@gnu.com",
      "EmployeeID": "01234567890",
      "TypeID": "work",
      "Valid": true
    },
    {
      "EmailID": "064ce683900a4c5980898814ec863663",
      "EmailAddress": "free_software+3@gnu.org",
      "EmployeeID": "01234567890",
      "TypeID": "personal",
      "Valid": true
    },
    {
      "EmailID": "0e244abfb2264353983efc5fa0a01dd7",
      "EmailAddress": "free_software9@gnu.com",
      "EmployeeID": "01234567890",
      "TypeID": "other",
      "Valid": true
    },
    {
      "EmailID": "1a6b3ad16f13499e8bdf4ce66cdf8f62",
      "EmailAddress": "free_software4@gnu.com",
      "EmployeeID": "01234567890",
      "TypeID": "work",
      "Valid": false
    }
  ]
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Other user's email addresses (GET)

`/api/users_email`

### Arguments:

(headers)

session_id (str): the session id to use

employee_id (str): the employee id of the user to fetch

Query:

```
base_uri/api/users_email
```

```js 
await fetch(`base_uri/api/users_email`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            employee_id: employee_id
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success",
  "emails": [
    {
      "EmailID": "035db203029f46b484f84f4214822e3a",
      "EmailAddress": "free_software2@gnu.com",
      "EmployeeID": "01234567890",
      "TypeID": "work",
      "Valid": true
    },
    {
      "EmailID": "064ce683900a4c5980898814ec863663",
      "EmailAddress": "free_software+3@gnu.org",
      "EmployeeID": "01234567890",
      "TypeID": "personal",
      "Valid": true
    },
    {
      "EmailID": "0e244abfb2264353983efc5fa0a01dd7",
      "EmailAddress": "free_software9@gnu.com",
      "EmployeeID": "01234567890",
      "TypeID": "other",
      "Valid": true
    },
    {
      "EmailID": "1a6b3ad16f13499e8bdf4ce66cdf8f62",
      "EmailAddress": "free_software4@gnu.com",
      "EmployeeID": "01234567890",
      "TypeID": "work",
      "Valid": false
    }
  ]
}
```

Error (498):

```json 
{
    "status": "error",
    "reason": "Invalid or expired token"
}
```

## Add to user's email addresses (POST)

`/api/add_user_email`

### Arguments:

(headers)

session_id (str): the session id to use

email_address (str): the email address to add for the user

type (str): the type of the email to add for the user

Query:

```
base_uri/api/add_user_email
```

```js 
await fetch(`base_uri/api/add_user_email`,
    {
        method: 'POST',
        headers: {
            session_id: session_id,
            email_address: email_address,
            type: "<personal|work|other>"
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## User's own phone numbers (GET)

`/api/user_phone`

### Arguments:

(headers)

session_id (str): the session id to use

Query:

```
base_uri/api/user_email
```

```js 
await fetch(`base_uri/api/user_phone`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success",
  "phone_numbers": [
    {
      "PhoneNumberID": "0c57108b25a7436ea0d16e5b03dac157",
      "AreaCode": "456",
      "Number": "7890123",
      "TypeID": "mobile",
      "Valid": true,
      "EmployeeID": "01234567890"
    },
    {
      "PhoneNumberID": "1e7b4b54968d40cfb7e9c5850601e999",
      "AreaCode": "890",
      "Number": "1234567",
      "TypeID": "home",
      "Valid": true,
      "EmployeeID": "01234567890"
    },
    {
      "PhoneNumberID": "2147a6b0a5a14b179a78a0f462865a92",
      "AreaCode": "567",
      "Number": "8901234",
      "TypeID": "work",
      "Valid": true,
      "EmployeeID": "01234567890"
    },
    {
      "PhoneNumberID": "4ff557787c2b4801b27316a586138167",
      "AreaCode": "789",
      "Number": "0123456",
      "TypeID": "work",
      "Valid": false,
      "EmployeeID": "fax"
    }
  ]
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Other user's phone numbers (GET)

`/api/users_phone`

### Arguments:

(headers)

session_id (str): the session id to use

employee_id (str): the employee id of the user to fetch

Query:

```
base_uri/api/users_phone
```

```js 
await fetch(`base_uri/api/users_phone`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            employee_id: employee_id
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success",
  "phone_numbers": [
    {
      "PhoneNumberID": "0c57108b25a7436ea0d16e5b03dac157",
      "AreaCode": "456",
      "Number": "7890123",
      "TypeID": "mobile",
      "Valid": true,
      "EmployeeID": "01234567890"
    },
    {
      "PhoneNumberID": "1e7b4b54968d40cfb7e9c5850601e999",
      "AreaCode": "890",
      "Number": "1234567",
      "TypeID": "home",
      "Valid": true,
      "EmployeeID": "01234567890"
    },
    {
      "PhoneNumberID": "2147a6b0a5a14b179a78a0f462865a92",
      "AreaCode": "567",
      "Number": "8901234",
      "TypeID": "work",
      "Valid": true,
      "EmployeeID": "01234567890"
    },
    {
      "PhoneNumberID": "4ff557787c2b4801b27316a586138167",
      "AreaCode": "789",
      "Number": "0123456",
      "TypeID": "fax",
      "Valid": false,
      "EmployeeID": "01234567890"
    }
  ]
}
```

Error (498):

```json 
{
    "status": "error",
    "reason": "Invalid or expired token"
}
```

## Add to user's phone numbers (POST)

`/api/add_user_phone`

### Arguments:

(headers)

session_id (str): the session id to use

phone_number (str): the number to add for the user

phone_type (str): the type of the phone number to add for the user

Query:

```
base_uri/api/add_user_phone
```

```js 
await fetch(`base_uri/api/add_user_phone`,
    {
        method: 'POST',
        headers: {
            session_id: session_id,
            phone_number: phone_number,
            type: "<mobile|home|work|fax>"
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:

```json
{
  "status": "success"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Product requirements (GET)

`/api/product_requirements`

### Arguments:

product (str): product name

### Example:

Query:

```
base_uri/api/product_requirements?product=sourdough
```

Response:

```json
{"data": "data"}
```

## Add product requirements (POST)

`/api/add_product_requirements`

### Arguments:

(body)

product (str): product name

requirements (?): ?

### Example:

Query:

```
base_uri/api/add_product_requirements
```

## Delete product requirements (DELETE)

`/api/delete_product_requirements`

### Arguments:

(body)

product (str): product name

### Example:

Query:

```
base_uri/api/delete_product_requirements
```

Response:

```json
{"status": "success"}
```

## Inventory (GET)

`/api/inventory`

### Arguments:

page (Number/int)

### Example:

Query:

```
base_uri/api/inventory
```

Response:
(paginated)
```json
{
    "page": 1,
    "items": [
        {
            "name": "butter",
            "count": 200
            }
    ]
}
```

## Inventory Item (GET)

`/api/inventory_item`

### Arguments:

item (str): item name

### Example:

Query:

```
base_uri/api/inventory_item?item=butter
```

Response:

```json
{
    "name": "butter",
    "count": 200,
    "expiration_date": "1724797536",
    "supplier_info": "data",
    "order_info": "how do I order this?"
}
```

<!--
## Reminders

`/api/reminders`

### Arguments:

None

### Example:

Query:

```
base_uri/api/reminders
```

Response:

```json
[
    {
        "name": "name",
        "time": "1724797536",
        "notes": "butter expiration"
    },
    ...
]
```
-->



