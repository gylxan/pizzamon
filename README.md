# README

This project was bootstrapped with [Create React App](<https://github.com/facebook/create-react-app>).

## Available Scripts

In the project directory, you can run:

### `npm run client`

Runs the client app in development mode.  
Open [<http://localhost:3000>] to view it in the browser.  
*Notice*: You also need to start the server with the API
or an alternative API on the same host.

### `npm run server`

Runs the server with API in development mode.  
The server will be watched with *nodemon* for changes in the code.
The API runs on [0.0.0.0:5000].

### `npm run dev`

Runs the server and the API in development mode on *0.0.0.0*.  
Use this for developing in the App and the server.  
Open [<http://localhost:3000>] to view it in the browser.  
The client proxies its API calls to port *5000*, where the server
with the API listens.

### `npm run initiate`

Initiates the database with default seeds for missing data.  
*Notice*: Later we can do migrations here maybe, too.

### `npm start`

Runs the following steps to start the server with the App in production mode

* Initiates the database (`npm run initiate`)
* Starts the server with node
  * The server serves the built App by any URL

You can specify the host and port by setting `env.HOST` and `env.PORT`.  
Default is [<http://0.0.0.0:5000>].>

### Docker

To use pizzamon in a container, make sure docker is installed on your system.

**Dependencies:**

* docker
* docker-compose

#### dockerfile

You can create a running container from the dockerfile. The command `docker build -t pizzamon .` is building a local container with the name `pizzamon`. This container can be run with e.g. `docker run pizzamon -p 3000:3000 -p 5000:5000`.

#### docker-compose

First create the folder `app_data` in you local workspace, this folder will be used as a mountpoint for the working directory.

A dev enviroment can be created using `docker-compose up -d --build`. To shutdown the container, execute `docker-compose down`.

To remove the named volume, you need explicitly execute `docker volume rm pizzamon_app_data`. It will not be removed via `docker system prune`.