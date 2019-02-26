var express = require('express');
var router = express.Router();
const { db } = require('../database/database');

const INDICATOR = 'restaurants';
// Root without parameter
router.route('/')
	.get((req, res) => {
		res.send(db.get(INDICATOR).value());
	})

// Root with name identifier
router.route('/:name')
// Get one by name
	.get((req, res, next) => {
		if (restaurantExists(req, res, next)) {
			res.send(db.get(INDICATOR).find({ name: req.params.name }).value());
		}
	});

const restaurantExists = (req, res, next) => {
	if (db.get(INDICATOR).find({ name: req.params.name }).size().value() === 0) {
		next('Kein Restaurant mit dem Namen \'%1\' gefunden'.replace('%1', req.params.name));
		return false;
	}
	return true;
};
module.exports = router;
