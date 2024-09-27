# CSC 4610 Project API

## Routes

Account Related:

[Create Account (POST)](#create-account-post)

[Login (POST)](#login-post)

[Logout (POST)](#logout-post)

[Token Bump (POST)](#token-bump-post)

Account Information Related: 

[User's own email addresses (GET)](#users-own-email-addresses-get)

[Delete user's own email address (DELETE)](#delete-users-email-address-delete)

[Get another user's email addresses (GET)](#get-another-users-email-addresses-get)

[Add to user's email addresses (POST)](#add-to-users-email-addresses-post)

[User's own phone numbers (GET)](#users-own-phone-numbers-get)

[Add to user's phone numbers (POST)](#add-to-users-phone-numbers-post)

[Delete user's phone number (DELETE)](#delete-users-phone-number-delete)

[Another user's phone numbers (GET)](#another-users-phone-numbers-get)

User management:

[Get a list of users (GET)](#get-a-list-of-users-get)

Ingredients:

[Get ingredients (GET)](#get-ingredients-get)

[Get ingredients short (GET)](#get-ingredients-short-get)

[Get ingredient by id (GET)](#get-ingredient-by-id-get)

[Add an ingredient (POST)](#add-an-ingredient-post)

[Delete an Ingredient (DELETE)](#delete-an-ingredient-delete)

<!--[Update an ingredient (PUT)](#update-an-ingredient-put)-->

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

## Delete user's email address (DELETE)

`/api/user_email`

### Arguments:

(headers)

session_id (str): the session id to use

email_address (str): the email address to delete for the user

Query:

```
base_uri/api/user_email
```

```js 
await fetch(`base_uri/api/user_email`,
    {
        method: 'DELETE',
        headers: {
            session_id: session_id,
            email_address: "<email_address_to_delete>"
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

Error (409):

```json 
{
  "status": "error",
  "reason": "Email address does not exist for the user"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Get another user's email addresses (GET)

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

## Delete user's phone number (DELETE)

`/api/user_phone`

### Arguments:

(headers)

session_id (str): the session id to use

phone_number (str): the number to delete for the user

Query:

```
base_uri/api/user_email
```

```js 
await fetch(`base_uri/api/user_phone`,
    {
        method: 'DELETE',
        headers: {
            session_id: session_id,
            phone_number: "<phone_number_to_delete>",
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

Error (409):

```json 
{
  "status": "error",
  "reason": "Phone number does not exist for the user"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Another user's phone numbers (GET)

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

## Get a list of users (GET)

`/api/user_list`

### Arguments:

(headers)

session_id (str): the session id to use

page (Number, int): the page number to start with, default 1

page_size (Number, int): the number of users per page of the response, default 20

Query:

```
base_uri/api/user_list
```

```js 
await fetch(`base_uri/api/user_list`,
    {
        method: 'GET',
        headers: {
            session_id: session_id
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

or

```js 
await fetch(`base_uri/api/user_list`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            page: String(page),
            page_size: String(page_size)
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
  "page": 1,
  "page_count": 1,
  "content": [
    {
      "EmployeeID": "01234567890",
      "FirstName": "Richard",
      "LastName": "Stallman",
      "Username": "freethesoftware"
    },
    {
      "EmployeeID": "T1000",
      "FirstName": "Robert",
      "LastName": "Patrick",
      "Username": "whereisjsohnconnor"
    },
    {
      "EmployeeID": "T800",
      "FirstName": "Arnold",
      "LastName": "Schwarzenegger",
      "Username": "protectjohnconnor"
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

## Get ingredients (GET)

`/api/ingredients`

### Arguments:

(headers)

session_id (str): the session id to use

Query:

```
base_uri/api/ingredients
```

```js 
await fetch(`base_uri/api/ingredients`,
    {
        method: 'GET',
        headers: {
            session_id: session_id
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
  "content": [
    {
      "IngredientID": "04ac08a054b147b4a9415c8bb95a3bed",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "g",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "31abe85784764824bd07a95199f5bc52",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "kg",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "4263a39ae0ee4d4685b919519f8a15bb",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "kg",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "49caa4c19b56454482f29ecd32581880",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "kg",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "4b595b76089b47d2beb787c0a83737ce",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "g",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "5a12ba2235974a32921eec97939e5951",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "units",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "75f0d872ad3b4713b45ad6b11b2d0a03",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "mL",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "78cb940d6e50466b9cc752724dae907f",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "g",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "987057807e3c46fd96d6c89d8868749b",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "L",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "IngredientID": "b6a242f1c7404346a6b7e983f1535b69",
      "InventoryID": "2457caf1bf37474d9231a0a64f655355",
      "Quantity": 10,
      "UnitOfMeasure": "kg",
      "Name": "Chocolate Chips",
      "ShelfLife": 1,
      "ShelfLifeUnit": "day",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
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

## Get ingredients short (GET)

`/api/ingredients_short`

### Arguments:

(headers)

session_id (str): the session id to use

Query:

```
base_uri/api/ingredients_short
```

```js 
await fetch(`base_uri/api/ingredients_short`,
    {
        method: 'GET',
        headers: {
            session_id: session_id
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
  "content": [
    {
      "IngredientID": "1ba4277d61f14b8888081b9ae93ddbbb",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "mL"
    },
    {
      "IngredientID": "240641e1e1574e96bf44a0072f3ebc6a",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "kg"
    },
    {
      "IngredientID": "25d75e0b8fbf49549d94c123afc34d8c",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "units"
    },
    {
      "IngredientID": "27df757ee2b8429b954095fe88460be1",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "kg"
    },
    {
      "IngredientID": "2f2c2052122b4f3fb3da3358ae50fe26",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "L"
    },
    {
      "IngredientID": "3b492d7a55d840e99d639f9e3abca615",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "kg"
    },
    {
      "IngredientID": "48e472c148144ba7b5c6625c29f7bff2",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "g"
    },
    {
      "IngredientID": "797bb8035c7c4a1dbaa31896bb75b13f",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "kg"
    },
    {
      "IngredientID": "93663a4cf8a042078e744af047aa3b18",
      "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
      "Name": "Chocolate Chips",
      "Quantity": 10,
      "UnitOfMeasure": "g"
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

## Get ingredient by id (GET)

`/api/ingredient`

### Arguments:

(headers)

session_id (str): the session id to use

ingredient_id (str): the ingredient to get more detailed information for

Query:

```
base_uri/api/ingredient
```

```js 
await fetch(`base_uri/api/ingredient`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            ingredient_id: "<ingredient_id>"
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
  "content": {
    "IngredientID": "14fccd4e6d194322a9dcefd1a2e009df",
    "InventoryID": "b80b42a3cb3648139ce8116c47fe09df",
    "Quantity": 10,
    "UnitOfMeasure": "g"
  }
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Add an ingredient (POST)

`/api/ingredient`

### Arguments:

(headers)

session_id (str): the session id to use

inventory_id (str): ingredient in the inventory to associate with.

quantity (float|int|Number): Amount of the ingredient

unit_of_measurement (str): Product unit of measurement

Query:

```
base_uri/api/ingredient
```

```js 
await fetch(`base_uri/api/ingredient`,
    {
        method: 'POST',
        headers: {
            session_id: "<session_id>",
            inventory_id: "<inventory_id>",
            quantity: "<quantity>",
            unit_of_measurement: "<unit_of_measurement>"
        },
    }
    ).then(
        (response) => {response.json();}
    ).catch(() => {});
```

Response:
<!-- IngredientID could be useful, I guess -->
```json
{
  "status": "success",
  "content": {
    "IngredientID": "b81d751cb98b475fa763959dd20bbb07",
    "InventoryID": "d21d751cb98bbb8763959d07b475fa0b",
    "Quantity": 22.2,
    "UnitOfMeasure": "kg"
  }
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Delete an ingredient (DELETE)

`/api/ingredient`

### Arguments:

(headers)

session_id (str): the session id to use

ingredient_id (str): the ingredient to delete

Query:

```
base_uri/api/ingredient
```

```js 
await fetch(`base_uri/api/ingredient`,
    {
        method: 'DELETE',
        headers: {
            session_id: session_id,
            ingredient_id: "<ingredient_id>"
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

<!-- "PUT" update method not yet implemented. See the source code for more details. 

## Update an ingredient (PUT)

`/api/ingredient`

### Arguments:

(headers)

session_id (str): the session id to use

description (str): Product description

category (str): Product category

measurement (str): Product unit of measurement

max_amount (float|int|Number): The maximum amount of a product. It must be positive and < 999999.99

reorder_amount (float|int|Number): The reorder amount of a product. It must be positive and < 999999.99

min_amount (float|int|Number): The minimum amount of a product. It must be positive and < 999999.99

Query:

```
base_uri/api/ingredient
```

```js 
await fetch(`base_uri/api/ingredient`,
    {
        method: 'PUT',
        headers: {
            session_id: "<session_id>",
            description: "<description>",
            category: "<category>",
            measurement: "<measurement>",
            max_amount: "<max_amount_num>",
            reorder_amount: "<reorder_amount_num>",
            min_amount: "<min_amount_num>"
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

-->

<!-- 
More endpoint docs can go below here. 
Check below to see if there are already skeleton docs.  
-->

---

<!-- Unimplemented endpoints:

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

-->

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



