/** @format */

const express = require('express');
const {
	createProducts,
	updateProducts,
	productDetails,
	deleteProduct,
	getAllProducts,
} = require('../controllers/productController');

const router = express.Router();

router.post('/create', createProducts);
router.put('/update/:_id', updateProducts);
router.get('/details/:_id', productDetails);
router.get('/details', getAllProducts);
router.delete('/delete/:_id', deleteProduct);

module.exports = router;
