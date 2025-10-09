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

router.post('/add', checkUserAuth, addToCart);
router.put('/update', checkUserAuth, updateCart);
router.get('/view', checkUserAuth, getCart);
router.delete('/delete', checkUserAuth, deleteCart);

module.exports = router;
