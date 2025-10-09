/** @format */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	category: { type: String, required: true },
	qty: { type: Number, required: true },
	commonDetails: {
		description: { type: String, required: true },
		brand: { type: String, required: true },
	},
	img: { type: String, required: true },
});
 
const productModel = new mongoose.model('products', productSchema);

module.exports = productModel;
 