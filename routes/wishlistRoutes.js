/** @format */

const express = require('express');
const {
	UpdateWishList,
	viewWishList,
	deleteWishList,
} = require('../controllers/wishlistController');
const checkUserAuth = require('../middleware/authMiddleware');

const router = express.Router();

//route level middleware
router.use('/wishlist', checkUserAuth);
router.use('/wishlist', checkUserAuth);
router.use('/wishlist', checkUserAuth);

//routes
router.post('/wishlist/', UpdateWishList);
router.get('/wishlist', viewWishList);
router.delete('/wishlist/', deleteWishList);

module.exports = router;
 