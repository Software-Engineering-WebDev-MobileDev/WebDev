# CSC 4610 Project API

Routes

## Create Account (POST)

`/api/login`

### Arguments:

(header)

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
            username: "user",
            password: "password",
            role: "user"    // Either user or employee currently
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

```
JWT?
```

## Login (POST)

`/api/login`

### Arguments:

(header)

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

```
JWT?
```

## Logout (POST)

`/api/logout`

### Arguments:

(body)

JWT?

Query:

```
base_uri/api/logout
```

```js 
await fetch("base_uri/api/logout", 
	{
		method: "POST",
        headers: {
            jwt: "?"
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



