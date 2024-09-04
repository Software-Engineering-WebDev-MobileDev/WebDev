# Setup

First, ensure you have installed [node.js](https://nodejs.org/en/download/package-manager/current)

Then, from within the `backend` directory, run:

```shell 
npm install
```

The backend server can then be run with the following:

```shell 
node index.js
```

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
