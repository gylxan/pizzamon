#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
var argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const migrate = require('./server/database/migrate');
// Migrate database
migrate();
const app = express();
// Check whether port is set via cli arguments or environment
const port = argv.port || process.env.PORT || 5000;
// Check whether host is set via cli arguments or environment
const host = argv.host || process.env.HOST || '0.0.0.0';
const apiRoutes = require('./server/routes/index');
// Start app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use defined api paths under ./server/api
app.use('/api', apiRoutes);

// Run in production
if (process.env.NODE_ENV === 'production') {
	console.log('Start server in production mode');
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client')));
	// Handle React routing, return all requests to React app
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client', 'index.html'));
	});
} else {
	console.log('Start server in development mode');
}

// Default error handling
app.use(function errorHandler(err, req, res, next) {
	res.status(400).send({ error: err });
});

app.listen(port, host, () => console.log(`Listening on ${host}:${port}`));
