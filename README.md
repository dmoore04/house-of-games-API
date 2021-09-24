# House of Games RESTful API

## Overview

This project mimics the behaviour of a real world back-end service allowing the user to programatically access data about various board games which could later be served to some front-end architecture for rendering.

</br>

The API is built with [Node.js](https://nodejs.org/en/), making use of the [Express.js](https://expressjs.com/) framework for our server and the [node-postgres](https://node-postgres.com/) package for interacting with our [PostgreSQL](https://www.postgresql.org/) database. TDD was applied throughout development using the test suite [Jest](https://jestjs.io/) to incrementally add features to the app.

</br>

[Try it out!](https://board-games-api.herokuapp.com/api)

---

## Technologies

_This REST API is built using the back-end portion of the [PERN stack](https://www.geeksforgeeks.org/what-is-pern-stack/)._
| Technology | Description |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js** | The core of the project, allows our JavaScript code to be run on a server and enables package integrations with [npm](https://www.npmjs.com/). |
| **Express.js** | Our framework for building back-end web applications on top of. Simplifies server routing and HTTP interactions. |
| **PostgreSQL** | The relational database management system that stores and serves up our data with help from [node-postgres](https://node-postgres.com/). |

---

## Requirements

### **Software**

**Node.js [15.0.1](https://nodejs.org/en/blog/release/v15.0.1/) >=**

```shell
~$ node --version
v15.0.1
```

**PostgreSQL [13.3](https://www.postgresql.org/docs/13/release-13-3.html) >=**

```shell
~$ psql --version
psql (PostgreSQL) 13.3
```

</br>

### **User dependencies**

_Needed to run the app and access data locally on your machine._

```yaml
"dependencies":
  {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "pg": "^8.7.1",
    "pg-format": "^1.0.4",
  }
```

</br>

### **Development dependencies**

_Needed to test changes you make to the project._

```yaml
"devDependencies":
  {
    "jest": "^27.2.0",
    "jest-sorted": "^1.0.12",
    "nodemon": "^2.0.12",
    "supertest": "^6.1.6",
  }
```

---

## Setting it up

_If you wish to develop this project further you should first fork a copy of this repo to your own GitHub account. Execute any commands pointing to the repo with your new URL_

### **Cloning and dependencies**

1. Clone the repo to your local machine </br>
   _This will create and navigate to the folder **`be-nc-games`**_

```shell
~$ git clone https://github.com/dmoore04/be-nc-games.git && cd be-nc-games
```

</br>

2. Install the npm dependencies </br>
   _If you are developing this project add the `-D` flag to also install the development dependencies_

```shell
~$ npm install

added 510 packages, and audited 511 packages in 4s

found 0 vulnerabilities
```

</br>

### **Database Setup and Seeding**

1. Create our test and development databases </br>
   _execute the custom npm script to create both databases on your machine_

```shell
~$ npm run setup-dbs

> be-nc-games@1.0.0 setup-dbs
> psql -f ./db/setup.sql

DROP DATABASE
DROP DATABASE
CREATE DATABASE
CREATE DATABASE
```

</br>

2. Create .env files to hold our enviroment variables </br>
   _we create one for both the development and test database_

```shell
~$ echo PGDATABASE=nc_games > .env.development && \
   echo PGDATABASE=nc_games_test > .env.test
```

</br>

3. Seed the development database </br>
   _running the test suite will seed the test database by default_

```shell
~$ npm run seed

> be-nc-games@1.0.0 seed
> node ./db/seeds/run-seed.js
```

</br>

### **All done**

You can now start the app locally and make requests to your server with a program like [Insomnia](https://insomnia.rest/) </br>
_You can kill the server at any point using `CTRL+C`_

```shell
~$ npm run start

> be-nc-games@1.0.0 start
> node listen.js

Listening on 9090...
_
```

</br>

### _For Developers_

You are now free to make changes to the app, you can make use of two scripts to help you when adding new features:

- ```shell
  ~$ npm run dev
  ```

  - This script will start the app with [nodemon](https://www.npmjs.com/package/nodemon) so you don't have to repeatedly restart your server after making changes

    </br>

- ```shell
  ~$ npm test
  ```
  - Use this to test the functionality off the app, use a third agument to specify test suites

</br>

## **_Thank you!_**
