This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:
### `npm run client`

Runs the client app in development mode.<br/>
Open [http://localhost:3000] to view it in the browser.<br/>
*Notice*: You also need to start the server with the API
or an alternative API on the same host.

### `npm run server`

Runs the server with API in development mode.<br/>
The server will be watched with *nodemon* for changes in the code.
The API runs on [0.0.0.0:5000].

### `npm run dev`
Runs the server and the API in development mode on *0.0.0.0*.<br/>
Use this for developing in the App and the server.<br/>
Open [http://localhost:3000] to view it in the browser.<br/>
The client proxies its API calls to port *5000*, where the server
with the API listens.

### `npm run initiate`
Initiates the database with default seeds for missing data.<br/>
*Notice*: Later we can do migrations here maybe, too.

### `npm start`
Runs the following steps to start the server with the App in production mode<br/>
* Initiates the database (`npm run initiate`)
* Starts the server with node
  * The server serves the built App by any URL

You can specify the host and port by setting `env.HOST` and `env.PORT`.<br/>.
Default is [http://0.0.0.0:5000]. 