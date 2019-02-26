var express = require('express');
var router = express.Router();
const { db } = require('../database/database');

const INDICATOR = 'orders';
// Root without parameter
router.route('/')
	.get((req, res) => {
		res.send(db.get(INDICATOR).value());
	})
	.post((req, res, next) => {
		if (!req.body.name || req.body.name.trim() === '') {
			next('Name ist leer');
		}
		console.log(req.body.name);
		// Check a order with this name doesn't exists
		if (db.get(INDICATOR)
			    .find({ name: req.body.name }).size().value() !== 0) {
			next('Bestellung mit Name "%1" existiert bereits'.replace('%1', req.body.name));
			return;
		}
		res.send(db.get(INDICATOR).push(req.body).write());
	});


// Root with name identifier
router.route('/:name')
// Get one by name
	.get((req, res, next) => {
		if (orderExists(req, res, next)) {
			res.send(db.get(INDICATOR).find({ name: req.params.name }).value());
		}
	})
	// Update ony by name
	.put((req, res, next) => {
		if (orderExists(req, res, next)) {
			res.send(db.get(INDICATOR).find({ name: req.params.name }).assign(req.body).write());
		}
	})
	// Delete ony by name
	.delete((req, res, next) => {
		if (orderExists(req, res, next)) {
			res.send(db.get(INDICATOR)
				.remove({ name: req.params.name })
				.write());
		}
	});

const orderExists = (req, res, next) => {
	if (db.get(INDICATOR).find({ name: req.params.name }).size().value() === 0) {
		next('Keine Bestellung mit dem Namen \'%1\' gefunden'.replace('%1', req.params.name));
		return false;
	}
	return true;
};
router.route('/:name/articles')
	.post((req, res, next) => {

		if (!orderExists(req, res, next)) {
			return;
		}
		if (!req.body.customer || req.body.customer.trim() === '') {
			next('Kunde ist leer');
			return;
		}

		const order = db.get(INDICATOR).find({ name: req.params.name }).value();
		// Check there is already an article for the user in the order
		if (order.articles.filter((article) => article.customer === req.body.customer).length > 0) {
			next('Ein Kunde \'%1\' existiert bereits in der Bestellung \'%2\''.replace('%1', req.body.customer).replace('%2', req.params.name));
		} else {
			order.articles.push(req.body);
			res.send(db.get(INDICATOR).find({ name: req.params.name }).assign(order).write());
		}
	});
router.route('/:name/articles/:customer')
	.put((req, res, next) => {
		if (!orderExists(req, res, next)) {
			return false;
		}
		if (!req.params.customer || req.params.customer.trim() === '') {
			next('Kunde ist leer');
			return;
		}
		if (req.params.customer !== req.body.customer) {
			next('Kunde in der URL unterscheidet sich von dem im Body');
			return;
		}

		const order = db.get(INDICATOR).find({ name: req.params.name }).value();
		// Get all without the specified one
		const filteredArticles = order.articles.filter((element) => element.customer.toLowerCase() !== req.params.customer.toLowerCase());
		// When we still have the same size of articles, the putted user wasn't in the articles!
		if (filteredArticles === order.articles) {
			next('Ein Kunde \'%1\' in der Bestellung \'%2\' existiert nicht'.replace('%1', req.body.customer).replace('%2', req.params.name));
			return;
		}
		// Now add the updated one
		filteredArticles.push(req.body);
		// Update order
		res.send(db.get(INDICATOR).find({ name: req.params.name }).assign({ articles: filteredArticles }).write());
	})
	.delete((req, res, next) => {
		if (!orderExists(req, res, next)) {
			return;
		}
		if (!req.params.customer || req.params.customer.trim() === '') {
			next('Kunde ist leer');
			return;
		}

		const order = db.get(INDICATOR).find({ name: req.params.name }).value();
		const filteredArticles = order.articles.filter((element) => element.customer.toLowerCase() !== req.params.customer.toLowerCase());
		res.send(db.get(INDICATOR).find({ name: req.params.name }).assign({ articles: filteredArticles }).write());
	});


module.exports = router;
