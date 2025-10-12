/** @format */

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'products', // Changed from 'products' to 'Product' for consistency
					required: true,
				},
				quantity: {
					// Changed from 'qty' to 'quantity' for clarity
					type: Number,
					required: true,
					default: 1,
					min: 1,
				},
			},
		],
	},
	{ timestamps: true }
);

const cartModel = new mongoose.model('cartItems', cartSchema);

module.exports = cartModel;
