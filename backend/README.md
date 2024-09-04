# Setup

First, ensure you have installed [node.js](https://nodejs.org/en/download/package-manager/current)

Then, from within the `backend` directory, run:

```shell 
npm install
```

## Backend

The backend server can be run with the following:

```shell 
node index.js
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
