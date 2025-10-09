/** @format */

const express = require('express');
const {
	placeOrder,
	buyNow,
	viewOrder,
	cancelOrder,
	refund,
	orderStatus,
	invoice,
} = require('../controllers/orderController');

const checkUserAuth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkout', checkUserAuth, placeOrder);
router.post('/buy-now', buyNow);
router.post('/cancel', cancelOrder);
router.post('/refund', refund);
router.post('/invoice', invoice);
router.get('/view/:_id', viewOrder); 
router.get('/status', orderStatus);

module.exports = router;
