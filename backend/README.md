# Setup

First, ensure you have installed [node.js **^18.20.4**](https://nodejs.org/en/download/package-manager/current)

Then, from within the `backend` directory, run:

```shell 
npm install
```

## Backend

The backend server can be run with the following:

(in the backend directory)
```shell 
npm run dev
```

## Database Only

The database can be started with:
```shell 
make start-db
```

If you are on Linux, you may need to run the command with root privileges like so:
```bash 
sudo docker compose up -d database
```

Or just this on Windows:
```shell 
docker compose up -d database
```

## Full Stack 

The development database is defined in [compose.yml](../compose.yml).

You can then build and start the whole stack with:
```shell 
docker compose build
docker compose up -d
```
<details>
    <summary>Older Docker Versions</summary>

```shell 
docker-compose build
docker-compose up -d
```
</details>

## Tests

Within [package.json](./package.json), there is a script for running tests appropriately called "test". In WebStorm, you can open this file and click the green run button in the gutter. 

Otherwise, you may run the tests (from the backend directory) with 
```shell 
npm run test
```

Note that for all test executions, the development database must be running. 
For API tests, the backend server must also be running to be tested. 

## Frontend

Follow the instructions for [Backend](#backend) and [Database Only](#database-only)

Running the dev server will serve the frontend, updating on reload. 
This might not be perfect, requiring a full reload of the page.  
