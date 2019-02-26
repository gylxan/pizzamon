const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const apiRoutes = require('./server/routes/index');
// Start app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use defined api paths under ./server/api
app.use('/api', apiRoutes);

// Run in production
process.env.NODE_ENV = 'production';
if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
	// Handle React routing, return all requests to React app
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

// Default error handling
app.use(function errorHandler(err, req, res, next) {
	res.status(400).send({ error: err });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
