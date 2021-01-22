## Architecture / Concepts / Structure for Main-Part

-> Main = "Backend"

## 0. index.ts

- entry point
- creates all objects (services) of all layers

### 1 Messaging

- communication with rendering process
- use a similar concept to http / rest

### 2. Windows

- classes / services to interact with windows

### 3. Service

- service layer
- main application logic

### 3. Persistence

- read / write data to (persistent) data stores

```
                 +--------------+
       +---------+MessageHandler+-------+
       |         +--------------+       |
       |                                |
       |                                |
       v                                v
 +-------------+                  +----------+
 |WindowService|----------------->|AppService|
 +-------------+                  +----------+
                                        |
                                        |
                                        v
                                  +----------+
                                  |DataAccess|
                                  +----------+
```
