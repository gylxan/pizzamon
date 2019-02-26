var router = require('express').Router();
var orderRoutes = require('./orders');
var restaurantRoutes = require('./restaurants');
//
// // split up route handling
router.use('/orders', orderRoutes);
router.use('/restaurants', restaurantRoutes);

module.exports = router;