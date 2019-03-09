const { db } = require('./database');

console.log('Initiate database');
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

console.log('Database initiated');

