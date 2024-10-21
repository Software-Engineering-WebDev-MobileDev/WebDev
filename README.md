# WebDev

## Setup For Use

For running this project using Docker compose, you may use the following Docker compose file

```yaml
services:
  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    restart: unless-stopped
    container_name: databased
    ports:
      - 1433:1433
    environment:
      - "ACCEPT_EULA=Y"
      - "MSSQL_SA_PASSWORD=Password123"
    hostname: databased
  server:
    image: samhaswon/webdev-server:latest   # Or use the `dev` tag for the latest changes
    container_name: webdev-server
    ports:
      - 3000:3000
    environment:
      - "NODE_ENV=development"
```

<details>
  <summary><b>Apple Silicon Macs</b></summary>

Microsoft, despite their current push for Windows on ARM, does not provide a version of the database container for ARM.
Plus, ARM is not tested well and is therefore not a part of our CI build. 
So, a few extra flags are needed to run the two containers. 

```yml 
services:
  # Local database instance for testing
  databased:
    image: mcr.microsoft.com/mssql/server:2022-latest
    platform: linux/amd64
    restart: unless-stopped
    container_name: databased
    ports:
      - 1433:1433
    environment:
      - "ACCEPT_EULA=Y"
      - "MSSQL_SA_PASSWORD=Password123"
    hostname: databased
  server:
    image: samhaswon/webdev-server:dev
    platform: linux/amd64
    container_name: dev-server
    ports:
      - 3000:3000
    environment:
      - "NODE_ENV=development"
      - "AZURE_SQL_SERVER=databased"
```
</details>

If this is part of a larger stack, you may need to set `NODE_ENV=development2`.

Alternatively, you may need to set up the network differently for the containers:

- Set `network_mode: bridge` for each container
- Set `AZURE_SQL_SERVER=` to the IP of the host in the server container. 
  - I.e.:
  ```yaml
    server:
      image: samhaswon/webdev-server:latest
      container_name: webdev-server
      ports:
        - 3000:3000
      environment:
        - "NODE_ENV=development"
        - "AZURE_SQL_SERVER=10.8.0.5"
      network_mode: bridge
    ```

## Setup For Development

For the mobile team, the above instructions should be sufficient. 
For developers of this repository, please see the instructions in the [Backend README](./backend/README.md).

Developers from both teams can view the API documentation at [DOCUMENTATION.md](./backend/DOCUMENTATION.md)

## Layout

```mermaid 
graph TB
    subgraph Mobile 
        app
    end
    subgraph Browser 
        wp[Webpage]
    end
    subgraph Docker
      subgraph "webdev-server (Node.js)"
        direction TB
        exp[Express] <--> expr[Express Router]
        api["/api/..."]
        public["/&lt;public&gt;"]
        expr <--> api
        public --> expr
        html["nunjucks"] --> public
      end
      subgraph "databased (MSSQL)"
          database
          api <--> database
      end
      app <---> exp
      wp <---> exp
    end
```
