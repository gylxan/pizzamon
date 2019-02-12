var router = require('express').Router();

// split up route handling
router.use('/orders', require('./orders'));

module.exports = router;