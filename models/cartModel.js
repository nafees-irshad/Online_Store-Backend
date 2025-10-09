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
				productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
				qty: { type: Number, default: 1 },
			},
		],
	},
	{ timestamps: true }
);

const cartModel = new mongoose.model('cartItems', cartSchema);

module.exports = cartModel;
