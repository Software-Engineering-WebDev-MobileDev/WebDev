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

Inventory/Purchase Orders:

[Get inventory (GET)](#get-inventory-get)

[Get inventory item (GET)](#get-inventory-item-get)

[Add inventory item (POST)](#add-inventory-item-post)

[Update inventory item (PUT)](#update-inventory-item-put)

[Delete an inventory item (DELETE)](#delete-an-inventory-item-delete)

[Update an inventory quantity (POST)](#update-an-inventory-quantity-post)

[Get inventory change history (GET)](#get-inventory-change-history-get)

[Delete an inventory change (DELETE)](#delete-an-inventory-change-delete)

[Get inventory amounts (GET)](#get-inventory-amounts-get)

[Get purchase orders (GET)](#get-purchase-orders-get)

[Get a purchase order by id (GET)](#get-a-purchase-order-by-id-get)

[Add a purchase order (POST)](#add-a-purchase-order-post)

[Delete a purchase order by id (DELETE)](#delete-a-purchase-order-by-id-delete)

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

## Get inventory (GET)

`/api/inventory`

### Arguments:

(headers)

session_id (str): the session id to use

page (int): the page to retrieve, optional, default of 1

page_size (int): the size of retrieved pages, optional, default of 20 and max of 30

Query:

```
base_uri/api/inventory
```

```js 
await fetch(`base_uri/api/inventory`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            page: 1,
            page_size: 20
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
      "InventoryID": "06c6435b92f042c9bdd16c1130dc6121",
      "Name": "vanilla extract",
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 5,
      "ReorderUnit": "liters"
    },
    {
      "InventoryID": "3bba846ec5b34b55838e8c0f27451802",
      "Name": "eggs",
      "ShelfLife": 30,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 100,
      "ReorderUnit": "pieces"
    },
    {
      "InventoryID": "487b700a9675499b8acdf499b3fe8ace",
      "Name": "salt",
      "ShelfLife": 1095,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 5,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "5e157c98c4f841759ea4cbbee1aef113",
      "Name": "yeast",
      "ShelfLife": 180,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 2,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "69e9e229aacf4de181a105e6848adeb0",
      "Name": "cocoa powder",
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 15,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "8a8748b4419c492aa3441123b3d4608f",
      "Name": "butter",
      "ShelfLife": 180,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 20,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "8fd386f46f9145509858a29508dea735",
      "Name": "baking powder",
      "ShelfLife": 365,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "ab84a7fc1e634f9784d4607f3b87f870",
      "Name": "flour",
      "ShelfLife": 365,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 50,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "dabd921428bb4e3db768160d82d3eb13",
      "Name": "sugar",
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 30,
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

## Get inventory item (GET)

`/api/inventory_item`

### Arguments:

(headers)

session_id (str): the session id to use

inventory_id (str): the inventory item to retrieve

Query:

```
base_uri/api/inventory_item
```

```js 
await fetch(`base_uri/api/inventory_item`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            inventory_id: "06c6435b92f042c9bdd16c1130dc6121"
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
    "InventoryID": "06c6435b92f042c9bdd16c1130dc6121",
    "Name": "vanilla extract",
    "ShelfLife": 730,
    "ShelfLifeUnit": "days",
    "ReorderAmount": 5,
    "ReorderUnit": "liters"
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

## Add inventory item (POST)

`/api/inventory_item`

REQUIRES `manager` ROLE OR GREATER!

### Arguments:

(headers)

session_id (str): the session id to use

name (str): the name of the inventory item to be added

shelf_life (int): the shelf life of the item, optional, ignored if shelf_life_unit not given

shelf_life_unit (str): the shelf life unit of the item, optional, ignored if shelf_life not given

reorder_amount (float|int): the item's reorder amount

reorder_unit (str): the item's reorder amount unit

Query:

```
base_uri/api/inventory_item
```

```js 
await fetch(`base_uri/api/inventory_item`,
    {
        method: 'POST',
        headers: {
            session_id: session_id,
            name: "<item_name>",
            shelf_life: "<shelf_life_num>",
            shelf_life_unit: "<shelf_life_unit>",
            reorder_amount: "<reorder_amount>",
            reorder_unit: "<reorder_unit>"
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
  "inventory_id": "06c6435b92f042c9bdd16c1130dc6121"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Update inventory item (PUT)

`/api/inventory_item`

REQUIRES `manager` ROLE OR GREATER!

### Arguments:

(headers)

session_id (str): the session id to use

inventory_id (str): the inventory id to update

name (str): the name of the inventory item to be added

shelf_life (int): the shelf life of the item, optional, ignored if shelf_life_unit not given

shelf_life_unit (str): the shelf life unit of the item, optional, ignored if shelf_life not given

reorder_amount (float|int): the item's reorder amount

reorder_unit (str): the item's reorder amount unit

Query:

```
base_uri/api/inventory_item
```

```js 
await fetch(`base_uri/api/inventory_item`,
    {
        method: 'PUT',
        headers: {
            session_id: session_id,
            inventory_id: "<inventory_id>",
            name: "<item_name>",
            shelf_life: "<shelf_life_num>",
            shelf_life_unit: "<shelf_life_unit>",
            reorder_amount: "<reorder_amount>",
            reorder_unit: "<reorder_unit>"
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
  "inventory_id": "06c6435b92f042c9bdd16c1130dc6121"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Delete an inventory item (DELETE)

`/api/inventory_item`

REQUIRES `manager` ROLE OR GREATER!

### Arguments:

(headers)

session_id (str): the session id to use

inventory_id (str): the inventory id to delete

Query:

```
base_uri/api/inventory_item
```

```js 
await fetch(`base_uri/api/inventory_item`,
    {
        method: 'DELETE',
        headers: {
            session_id: session_id,
            inventory_id: "<inventory_id>"
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

## Update an inventory quantity (POST)

`/api/inventory_change`

### Arguments:

(headers)

session_id (str): the session id to use

change_amount (int|float): the amount by which the inventory is being changed

inventory_id (str): the inventory id to associate with

description (str): the description of the change, optional

expiration_date (str): the expiration date (in ISO 8601 format) of product added, optional

Query:

```
base_uri/api/inventory_change
```

```js 
await fetch(`base_uri/api/inventory_change`,
    {
        method: 'POST',
        headers: {
            session_id: session_id,
            change_amount: "<the_change_amount>",
            inventory_id: "<inventory_id>",
            description: "Made a purchase or something",
            expiration_date: date.toISOString()
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
  "hist_id": "ab84a7fc1e634f9784d4607f3b87f870"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Get inventory change history (GET)

`/api/inventory_change`

### Arguments:

(headers)

session_id (str): the session id to use

page (int): the page to retrieve, optional, default of 1

page_size (int): the size of retrieved pages, optional, default of 20 and max of 30

Query:

```
base_uri/api/inventory_change
```

```js 
await fetch(`base_uri/api/inventory_change`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            page: 1,
            page_size: 20
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
      "InventoryID": "8a8748b4419c492aa3441123b3d4608f",
      "Name": "butter",
      "ShelfLife": 180,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 20,
      "ReorderUnit": "kg",
      "HistID": "0911b42510154241ab2ca208d9ea9e6c",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.247Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "487b700a9675499b8acdf499b3fe8ace",
      "Name": "salt",
      "ShelfLife": 1095,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 5,
      "ReorderUnit": "kg",
      "HistID": "260594ede64a47588f466468845a7940",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.243Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "06c6435b92f042c9bdd16c1130dc6121",
      "Name": "vanilla extract",
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 5,
      "ReorderUnit": "liters",
      "HistID": "2aafd864795446d9b0195adcc651dc5f",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.153Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "5e157c98c4f841759ea4cbbee1aef113",
      "Name": "yeast",
      "ShelfLife": 180,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 2,
      "ReorderUnit": "kg",
      "HistID": "380077e19db24e2bb8e07c52389848e2",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.243Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "dabd921428bb4e3db768160d82d3eb13",
      "Name": "sugar",
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 30,
      "ReorderUnit": "kg",
      "HistID": "5e84ba31ef59435cb8100a4c5a8f033b",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.247Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "3bba846ec5b34b55838e8c0f27451802",
      "Name": "eggs",
      "ShelfLife": 30,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 100,
      "ReorderUnit": "pieces",
      "HistID": "6b0241ac890542678a21aad9fd263a74",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.240Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "8fd386f46f9145509858a29508dea735",
      "Name": "baking powder",
      "ShelfLife": 365,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 10,
      "ReorderUnit": "kg",
      "HistID": "6d1d329c4ab745be939659e9cbdc274a",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.247Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "06c6435b92f042c9bdd16c1130dc6121",
      "Name": "vanilla extract",
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 5,
      "ReorderUnit": "liters",
      "HistID": "80368fb1fc854f3f8ae441c25e9f8c6d",
      "ChangeAmount": -20,
      "EmployeeID": "00123456789",
      "Description": "Used all the vanilla extract to make a singular load of bread",
      "Date": "2024-10-01T17:40:10.070Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "69e9e229aacf4de181a105e6848adeb0",
      "Name": "cocoa powder",
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 15,
      "ReorderUnit": "kg",
      "HistID": "8827483ad3ca4a2db488b156389d0f24",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.243Z",
      "ExpirationDate": null
    },
    {
      "InventoryID": "ab84a7fc1e634f9784d4607f3b87f870",
      "Name": "flour",
      "ShelfLife": 365,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 50,
      "ReorderUnit": "kg",
      "HistID": "d2c9b10996174a2f8324724c939f5bf6",
      "ChangeAmount": 20,
      "EmployeeID": "00123456789",
      "Description": null,
      "Date": "2024-10-01T17:40:10.247Z",
      "ExpirationDate": null
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

## Delete an inventory change (DELETE)

`/api/inventory_change`

### Arguments:

(headers)

session_id (str): the session id to use

hist_id (str): the hist_id to delete

Query:

```
base_uri/api/inventory_change
```

```js 
await fetch(`base_uri/api/inventory_change`,
    {
        method: 'DELETE',
        headers: {
            session_id: session_id,
            hist_id: "<hist_id>"
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

## Get inventory amounts (GET)

`/api/inventory_amount`

### Arguments:

(headers)

session_id (str): the session id to use

page (int): the page to retrieve, optional, default of 1

page_size (int): the size of retrieved pages, optional, default of 20 and max of 30

Query:

```
base_uri/api/inventory_amount
```

```js 
await fetch(`base_uri/api/inventory_amount`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            page: 1,
            page_size: 20
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
      "InventoryID": "06c6435b92f042c9bdd16c1130dc6121",
      "Name": "vanilla extract",
      "Amount": 0,
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 5,
      "ReorderUnit": "liters"
    },
    {
      "InventoryID": "3bba846ec5b34b55838e8c0f27451802",
      "Name": "eggs",
      "Amount": 40,
      "ShelfLife": 30,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 100,
      "ReorderUnit": "pieces"
    },
    {
      "InventoryID": "487b700a9675499b8acdf499b3fe8ace",
      "Name": "salt",
      "Amount": 40,
      "ShelfLife": 1095,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 5,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "5e157c98c4f841759ea4cbbee1aef113",
      "Name": "yeast",
      "Amount": 40,
      "ShelfLife": 180,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 2,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "69e9e229aacf4de181a105e6848adeb0",
      "Name": "cocoa powder",
      "Amount": 40,
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 15,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "8a8748b4419c492aa3441123b3d4608f",
      "Name": "butter",
      "Amount": 40,
      "ShelfLife": 180,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 20,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "8fd386f46f9145509858a29508dea735",
      "Name": "baking powder",
      "Amount": 40,
      "ShelfLife": 365,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 10,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "ab84a7fc1e634f9784d4607f3b87f870",
      "Name": "flour",
      "Amount": 40,
      "ShelfLife": 365,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 50,
      "ReorderUnit": "kg"
    },
    {
      "InventoryID": "dabd921428bb4e3db768160d82d3eb13",
      "Name": "sugar",
      "Amount": 40,
      "ShelfLife": 730,
      "ShelfLifeUnit": "days",
      "ReorderAmount": 30,
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

## Get purchase orders (GET)

`/api/purchase_order`

### Arguments:

(headers)

session_id (str): the session id to use

Query:

```
base_uri/api/purchase_order
```

```js 
await fetch(`base_uri/api/purchase_order`,
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
      "InventoryID": "adfd1785c0f245b3bc501c694ed98131",
      "Name": "flour",
      "PurchaseOrderID": "d2bc94a6f6e3418aa2122f2a4500ff76",
      "Date": "2024-10-05T23:08:36.973Z",
      "OrderQuantity": 20000,
      "Vendor": "Big Flour Power",
      "PayableAmount": 2000,
      "PayableDate": "2024-10-05T23:08:36.973Z",
      "EmployeeID": "00123456789"
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

## Get a purchase order by id (GET)

`/api/purchase_order_id`

### Arguments:

(headers)

session_id (str): the session id to use

purchase_order_id (str): the purchase order's id to get

Query:

```
base_uri/api/purchase_order_id
```

```js 
await fetch(`base_uri/api/purchase_order_id`,
    {
        method: 'GET',
        headers: {
            session_id: session_id,
            purchase_order_id: purchase_order_id
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
    "InventoryID": "adfd1785c0f245b3bc501c694ed98131",
    "PurchaseOrderID": "d2bc94a6f6e3418aa2122f2a4500ff76",
    "Name": "flour",
    "ShelfLife": 365,
    "ShelfLifeUnit": "days",
    "ReorderAmount": 50,
    "ReorderUnit": "kg",
    "Date": "2024-10-05T23:08:36.973Z",
    "OrderQuantity": 20000,
    "Vendor": "Big Flour Power",
    "PayableAmount": 2000,
    "PayableDate": "2024-10-05T23:08:36.973Z",
    "EmployeeID": "00123456789"
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

## Add a purchase order (POST)

`/api/purchase_order`

### Arguments:

(headers)

session_id (str): the session id to use

inventory_id (str): the inventory id to associate with this purchase order

date (str): ISO 8601 format date string

order_quantity (int|float|Number): the quantity of the order

vendor (str): the name of the vendor

payable_amount (int|float|Number): the payment amount for this particular order

payable_date (str): ISO 8601 format date string

Query:

```
base_uri/api/purchase_order
```

```js 
// Date for the purchase order
let test_date = new Date();

await fetch(`base_uri/api/purchase_order`,
    {
        method: 'POST',
        headers: {
            session_id: session_id,
            inventory_id: "<inventory_id>",
            date: test_date.toISOString(),
            order_quantity: "<order_quantity>",
            vendor: "<vendor>",
            payable_amount: "<payable_amount>",
            payable_date: test_date.toISOString()
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
  "purchase_order_id": "d2bc94a6f6e3418aa2122f2a4500ff76"
}
```

Error (498):

```json 
{
  "status": "error",
  "reason": "Invalid or expired token"
}
```

## Delete a purchase order by id (DELETE)

`/api/purchase_order`

### Arguments:

(headers)

session_id (str): the session id to use

purchase_order_id (str): the purchase order's id to delete

Query:

```
base_uri/api/purchase_order
```

```js 
await fetch(`base_uri/api/purchase_order`,
    {
        method: 'DELETE',
        headers: {
            session_id: session_id,
            purchase_order_id: purchase_order_id
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

---
