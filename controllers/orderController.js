/** @format */

const User = require('../models/userModel');
const Product = require('../models/productsModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

// Generate OrderId
function generateRandomId() {
	const prefix = 'CH#';
	const randomNumber = Math.floor(10000 + Math.random() * 9000);
	const now = new Date();
	const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
	return `${prefix}${randomNumber}-${time}`;
}

const placeOrder = async (req, resp) => {
	const orderId = generateRandomId();
	const {
		cartId,
		customerName,
		customerEmail,
		shippingAddress,
		paymentMethod,
	} = req.body;
	// console.log(updatedCart);
	const userId = req.user.id;

	try {
		// 🔹 **1 - Fetch cart by cartId**
		const cart = await Cart.findById(cartId);
		if (!cart || cart.products.length === 0) {
			return resp.status(400).json({ message: 'Cart is empty or not found' });
		}

		// 🔹 **2 - Fetch products from Product collection**
		const productIds = cart.products.map((p) => p.productId);
		const products = await Product.find({ _id: { $in: productIds } });

		let productInStock = [];
		let productOutOfStock = [];
		let total = 0;

		// 🔹 **3 - Check stock and update quantity**
		for (const cartProduct of cart.products) {
			const product = products.find(
				(p) => p._id.toString() === cartProduct.productId.toString()
			);
			if (!product) continue;

			const productDetails = {
				productId: product._id,
				name: product.name,
				price: product.price,
				quantity: cartProduct.quantity,
			};

			// Check stock availability
			if (product.qty >= cartProduct.quantity) {
				// Add to order
				total += product.price * cartProduct.quantity;
				productInStock.push(productDetails);

				// Subtract product quantity from stock
				await Product.updateOne(
					{ _id: product._id },
					{ $inc: { qty: -cartProduct.quantity } }
				);
			} else {
				// Product is out of stock
				productOutOfStock.push(productDetails);
			}
		}

		// 🔹 **4 - Prevent order if all products are out of stock**
		if (productInStock.length === 0) {
			return resp.status(400).json({
				message: 'All selected products are out of stock',
				productOutOfStock,
			});
		}

		// 🔹 **5 - Create and save order**
		const newOrder = new Order({
			orderId,
			userId,
			cartId,
			customerName,
			customerEmail,
			products: productInStock,
			totalAmount: total,
			shippingAddress,
			paymentMethod,
		});
		await newOrder.save();

		// 🔹 **6 - Remove only the ordered products from cart**
		const remainingProducts = cart.products.filter((cartProduct) =>
			productOutOfStock.some(
				(p) => p.productId.toString() === cartProduct.productId.toString()
			)
		);
		await Cart.findByIdAndUpdate(cartId, { products: remainingProducts });

		// 🔹 **7 - Send response**
		resp.status(200).json({
			message: 'Order Created Successfully',
			orderId: newOrder.orderId,
			totalAmount: total,
			productsOrdered: productInStock,
			productOutOfStock,
		});
	} catch (err) {
		console.error(err);
		resp.status(500).json({ message: 'Error Creating Order' });
	}
};

//buy now
const buyNow = async (req, res) => {
	try {
		const {
			customerName,
			customerEmail,
			shippingAddress,
			paymentMethod,
			products,
		} = req.body;

		if (
			!customerName ||
			!customerEmail ||
			!shippingAddress ||
			!paymentMethod ||
			!products.length
		) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// Fetch products from DB
		const productIds = products.map((item) => item.productId);
		const fetchedProducts = await Product.find({ _id: { $in: productIds } });

		if (!fetchedProducts.length) {
			return res.status(404).json({ message: 'No products found' });
		}

		let totalPrice = 0;
		let productDetails = [];
		let productOutofStock = [];

		// Check stock availability and calculate price
		for (let item of products) {
			const product = fetchedProducts.find(
				(p) => p._id.toString() === item.productId
			);
			if (!product) continue;

			// Create product object once
			const productDetail = {
				productId: product._id,
				name: product.name,
				price: product.price,
				quantity: item.qty,
			};

			if (product.qty >= item.qty) {
				// Update stock & calculate total price
				product.qty -= item.qty;
				totalPrice += product.price * item.qty;
				productDetails.push(productDetail);
			} else {
				// Modify object for out-of-stock products
				productDetail.availableQty = product.qty;
				productDetail.requestedQty = item.qty;
				productOutofStock.push(productDetail);
			}
		}

		// If some products are out of stock, return response without placing order
		if (productOutofStock.length) {
			return res.status(400).json({
				message: 'Some products are out of stock',
				productOutofStock,
			});
		}

		// Save updated stock in DB
		await Promise.all(fetchedProducts.map((product) => product.save()));

		// Create new order
		const newOrder = new Order({
			orderId: generateRandomId(),
			customerName,
			customerEmail,
			shippingAddress,
			paymentMethod,
			products: productDetails,
			totalAmount: totalPrice,
		});

		await newOrder.save();

		// Final response
		res.status(201).json({
			message: 'Order placed successfully',
			orderId: newOrder._id,
			totalAmount: totalPrice,
			products: productDetails,
		});
	} catch (error) {
		console.error('Error in Buy Now:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

const viewOrder = async (req, resp) => {
	const orderId = req.params;
	try {
		const order = await Order.findById(orderId);
		if (order) {
			resp.status(200).json(order);
		} else {
			resp.status(400).json('order Not Found');
		}
	} catch (err) {
		resp.status(500).json({ message: 'Internal Server error' });
	}
};

const cancelOrder = async (req, resp) => {
	const { orderId } = req.body;
	try {
		const order = await Order.findById(orderId);
		if (order.status === 'Pending') {
			await Order.updateOne(
				{ _id: orderId },
				{ $set: { status: 'Cancelled' } }
			);
		} else {
			resp.status(400).json('Order already Processed');
		}
		resp.status(200).json({
			message: 'Order Cancelled Successfully',
		});
	} catch (err) {
		console.log(err);
		resp.status(500).json({ message: 'Error Cancelling Order' });
	}
};

const refund = async (req, resp) => {
	const { orderId } = req.body;
	try {
		const order = await Order.findById(orderId);
		if (order.paymentStatus === 'Paid') {
			await Order.updateOne(
				{ _id: orderId },
				{ $set: { paymentStatus: 'Refunded' } }
			);
		} else {
			resp.status(400).json('Order Not Paid');
		}
		resp.status(200).json('Refund Processed Successfully');
	} catch (err) {
		console.log(err);
		resp.status(500).json({ message: 'Error Refunding Order' });
	}
};

const orderStatus = async (req, resp) => {
	const { orderId } = req.body;
	try {
		const order = await Order.findById(orderId);
		if (order) {
			resp.status(200).json({
				Status: order.status,
			});
		} else {
			resp.status(404).json('Order Not Found');
		}
	} catch (err) {
		console.log(err);
		resp.status(500).json({ message: 'Error Fetching Order Status' });
	}
};

const invoice = async (req, resp) => {
	//generate invoice number
	function generateInvoiceNumber() {
		const now = new Date();
		const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
		const invoiceNumber = 'INV-' + time;
		return invoiceNumber;
	}
	// const invoiceNumber = generateInvoiceNumber();
	const { orderId, paymentMethod } = req.body;
	let amountToBePaid = 0;
	const delieveryFee = 200;
	try {
		const order = await Order.findById(orderId);
		if (!order) {
			return resp.status(404).json('Order Not Found');
		}
		const products = order.products;
		const productDetails = products.map((product) => {
			return {
				name: product.name,
				price: product.price,
				quantity: product.quantity,
			};
		});
		if (paymentMethod === 'Cash on Delivery') {
			amountToBePaid = order.totalAmount + delieveryFee;
		} else {
			amountToBePaid = order.totalAmount + 0;
		}
		const responseObj = {
			orderId: order.orderId,
			invoiceNumber: generateInvoiceNumber(),
			products: productDetails,
			subTotal: order.totalAmount,
			deliveryFee: delieveryFee,
			taxes: 0,
			totalAmount: amountToBePaid,
			billingAddress: order.shippingAddress,
		};
		order.invoice = responseObj;
		await order.save();
		resp.status(200).json(responseObj);
	} catch (err) {
		console.log(err);
		resp.status(500).json({ message: 'Error in Order' });
	}
};
module.exports = {
	placeOrder,
	buyNow,
	viewOrder,
	cancelOrder,
	refund,
	orderStatus,
	invoice,
};
