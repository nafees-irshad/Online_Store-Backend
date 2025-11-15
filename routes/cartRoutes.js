/** @format */

const express = require('express');
const router = express.Router();

const {
	updateCart,
	getCart,
	deleteCart,
	addToCart,
} = require('../controllers/cartController');
const checkUserAuth = require('../middleware/authMiddleware');

router.post('/add', addToCart);
router.put('/update', updateCart);
router.get('/view', getCart);
router.delete('/delete', deleteCart);

module.exports = router;
