const { db } = require('./database');


const migrate = () => {
	console.log('Migration of database started');
	initiateDatabase();
	addPurchaserAndPurchaserDetermination();
	addCreatedTimestampToOrders();
	console.log('Migration of database finished');

};
const initiateDatabase = () => {
	console.log('Add defaults to database');
	db.defaults({
		'orders'     : [],
		'restaurants': [
			{
				'name'    : 'World of Pizza',
				'articles': [
					{
						'name' : 'Pizza Salami',
						'price': 6.5
					},
					{
						'name' : 'Pizza Tonno',
						'price': 6.5
					},
					{
						'name' : 'Pizza Gemüsebeet',
						'price': 6.5
					},
					{
						'name' : 'Pizza Curry',
						'price': 6.5
					},
					{
						'name' : 'Pizza California',
						'price': 6.5
					},
					{
						'name' : 'Pizza Chicken Kebap',
						'price': 6.5
					},
					{
						'name' : 'Pizza Philadelphia',
						'price': 6.5
					},
					{
						'name' : 'Pizza Cleveland',
						'price': 6.5
					},
					{
						'name' : 'Pizza Greenland',
						'price': 6.5
					},
					{
						'name' : 'Pizza Kansas',
						'price': 6.5
					},
					{
						'name' : 'Pizza Salamico Vegan',
						'price': 6.5
					},
					{
						'name' : 'Pizza Mistaer',
						'price': 6.5
					},
					{
						'name' : 'Pizza Montana',
						'price': 6.5
					},
					{
						'name' : 'Pizza Oklahoma Chicken',
						'price': 6.5
					},
					{
						'name' : 'Pizza Rucola',
						'price': 6.5
					},
					{
						'name' : 'Pizza Spring Rod',
						'price': 6.5
					},
					{
						'name' : 'Pizza Sucuk',
						'price': 6.5
					},
					{
						'name' : 'Pizza Texas',
						'price': 6.5
					},
					{
						'name' : 'Pizza Mango Traum',
						'price': 6.5
					},
					{
						'name' : 'Pizza Wop Dog',
						'price': 6.5
					},
					{
						'name' : 'Pizza Zingara',
						'price': 6.5
					},
					{
						'name' : 'Pizza Provence',
						'price': 6.5
					},
					{
						'name' : 'Pizza Hawaii',
						'price': 6.5
					},
					{
						'name' : 'BBQ Bacon Burger',
						'price': 7.12
					},
					{
						'name' : 'World Burger',
						'price': 7.12
					},
					{
						'name' : 'Chipotle Beef Burger',
						'price': 7.12
					},
					{
						'name' : 'Chili Cheese Burger',
						'price': 7.12
					},
					{
						'name' : 'Crispy Chicken Burger',
						'price': 7.12
					},
					{
						'name' : 'Falafel Burger',
						'price': 7.12
					}
				]
			}
		]
	}).write();

	console.log('Defaults added to database');
};

/**
 * Add "purchaser" and "purchaserDetermination" to Database
 */
const addPurchaserAndPurchaserDetermination = () => {
	const orders = db.get('orders').value();
	console.log('Add \'purchaser\' and \'purchaserDetermination\' to orders');
	// Add purchaser to all orders
	orders.map((order) => {
		if (order.purchaser === void 0) {
			order.purchaser = null;
		}
		if (order.purchaserDetermination === void 0) {
			order.purchaserDetermination = 'manual';
		}
		return order;
	});
	db.set('orders', orders).write();
	console.log('\'purchaser\' and \'purchaserDetermination\' added to orders');
};

/**
 * Add "createdAt" timestamp to all ordersto Database
 */
const addCreatedTimestampToOrders = () => {
	const orders = db.get('orders').value();
	console.log('Add \'createdAt\' to orders');
	// Add createdAt to all orders
	const timestamp = Date.now();
	orders.map((order) => {
		if (order.createdAt === void 0) {
			order.createdAt = timestamp;
		}
		return order;
	});
	db.set('orders', orders).write();
	console.log('\'createdAt\' added to orders');
};

module.exports = migrate;
