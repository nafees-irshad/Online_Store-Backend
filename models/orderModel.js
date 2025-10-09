/** @format */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: false,
	},
	orderId: {
		type: String,
		required: false,
	},
	cartId: {
		type: String,
		required: false,
	},
	customerName: {
		type: String,
		required: true,
	},
	customerEmail: {
		type: String,
		required: true,
	},
	products: [
		{
			productId: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	totalAmount: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ['Pending', 'Processed', 'Delievered', 'Cancelled', 'Refunded'],
		default: 'Pending',
		required: true,
	},
	paymentStatus: {
		type: String,
		enum: ['Not Paid', 'Paid', 'Refunded'],
		default: 'Not Paid',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	updateAt: {
		type: Date,
		default: null,
	},
	shippingAddress: {
		type: String,
		required: true,
	},
	billingAddress: {
		type: String,
		// required: true,
	},
	paymentMethod: {
		type: String,
		enum: ['Credit Card', 'EasyPiasa', 'Bank Transfer', 'Cash on Delivery'],
		default: 'Cash on Delivery',
		required: true,
	},
	trackingNumber: {
		type: String,
		default: null,
	},
	estimatedDeliveryDate: {
		type: Date,
		default: null,
	},
	invoice: {
		orderId: String,
		invoiceNumber: String,
		products: [
			{
				name: String,
				price: Number,
				quantity: Number,
			},
		],
		subTotal: Number,
		delieveryFee: Number,
		taxes: Number,
		totalAmount: Number,
		billingAddress: String,
	},
});

const orderModel = new mongoose.model('orders', orderSchema);

module.exports = orderModel;
