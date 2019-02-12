var express = require('express');
var router = express.Router();
const fs = require('fs');
const orderPath = './orders';


const loadOrders = () => {
	// Read all json files from the orders and put them into orders
	let orderFileContent, orders = [];
	fs.readdirSync(orderPath).forEach(file => {
		orderFileContent = fs.readFileSync(orderPath + '\\' + file);
		orders.push(JSON.parse(orderFileContent));
	});
	if (orders.length > 0) {
		console.log(`Found ${orders.length} existing ${orders.length > 1 ? 'orders' : 'order'}`);
	} else {
		console.log('No existing orders found');
	}
	return orders;
};

const createOrder = (name) => {

};
const updateOrder = (name, data) => {

};


const orders = loadOrders();
/*********************************************************************************************************
 * The routes
 *********************************************************************************************************/

// Root without parameter
router.route('/')
	.get((req, res) => {
		res.send(orders);
	})
	.post((req, res) => {
		res.send(
			`I received your POST request. This is what you sent me: ${req.body.post}`
		);
	});


// Root with name identifier
router.route('/:name')
	// Get one by name
	.get((req, res) => {
		const orderName = req.params.name;
		res.send(
			`I received your POST request. This is what you sent me: ${req.body.post}`
		);
	})
	.put((req, res) => {

		const orderName = req.params.name;
		const order = orders.filter((order) => order.name === orderName).shift();
		if (order) {

		}

		res.send(
			`I received your POST request. This is what you sent me: ${req.body.post}`
		);
	});





module.exports = router;
