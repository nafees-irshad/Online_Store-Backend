/** @format */

const Cart = require('../models/cartModel');
const Product = require('../models/productsModel');

//add to cart

const addToCart = async (req, res) => {
	const { productId, qty } = req.body;
	const userId = req.user.id;
 
	try {
		// 1. Check if product exists and in stock
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({
				status: 'Failed',
				message: 'Product not found',
			});
		}

		if (product.qty <= 0) {
			return res.status(400).json({
				status: 'Failed',
				message: 'Product out of stock',
			});
		}

		// 2. Find the user's cart
		let cart = await Cart.findOne({ userId });

		// 3. If no cart, create a new one
		if (!cart) {
			cart = new Cart({
				userId,
				products: [{ productId, qty: qty || 1 }],
			});
			await cart.save();
			return res.status(201).json({
				status: 'Success',
				message: 'Added to cart (new cart created)',
				cart,
			});
		}

		// 4. Check if the product already exists in the cart
		const productExist = cart.products.find(
			(p) => p.productId.toString() === productId
		);

		if (productExist) {
			// 5. If it exists, update its quantity
			await Cart.updateOne(
				{ userId, 'products.productId': productId },
				{ $inc: { 'products.$.qty': qty || 1 } }
			);
		} else {
			// 6. If not exists, push new product
			await Cart.updateOne(
				{ userId },
				{ $push: { products: { productId, qty: qty || 1 } } }
			);
		}

		res.status(200).json({
			status: 'Success',
			message: 'Product added to cart',
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'Failed',
			message: 'Internal server error',
		});
	}
};

const updateCart = async (req, res) => {
	const { productId, action } = req.body; // action = 'increase' | 'decrease' | 'remove'
	const userId = req.user.id;

	try {
		const cart = await Cart.findOne({ userId });
		if (!cart) {
			return res.status(404).json({
				status: 'Failed',
				message: 'Cart not found',
			});
		}

		const productIndex = cart.products.findIndex(
			(p) => p.productId.toString() === productId
		);

		if (productIndex === -1) {
			return res.status(404).json({
				status: 'Failed',
				message: 'Product not found in cart',
			});
		}

		// Handle actions
		if (action === 'increase') {
			cart.products[productIndex].qty += 1;
		} else if (action === 'decrease') {
			if (cart.products[productIndex].qty > 1) {
				cart.products[productIndex].qty -= 1;
			} else {
				// Remove if qty reaches 0
				cart.products.splice(productIndex, 1);
			}
		} else if (action === 'remove') {
			cart.products.splice(productIndex, 1);
		} else {
			return res.status(400).json({
				status: 'Failed',
				message: 'Invalid action',
			});
		}

		await cart.save();

		res.status(200).json({
			status: 'Success',
			message: 'Cart updated successfully',
			cart,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'Failed',
			message: 'Internal server error',
		});
	}
};

//view cart
const getCart = async (req, resp) => {
	const userId = req.params;
	try {
		const cart = await Cart.findOne(userId);
		if (cart) {
			resp.status(200).json(cart);
		} else {
			resp.status(200).json({ message: 'Cart not found' });
		}
	} catch (err) {
		console.error('Error creating order:', err);
		resp.status(500).send({ message: 'Internal Server Error' });
	}
};

//delete single cart item
const deleteCart = async (req, resp) => {
	const userId = req.user.id;
	try {
		const cart = await Cart.findOneAndDelete(userId);
		if (cart) {
			resp.status(200).json({
				status: 'success',
				message: 'cart removed',
			});
		} else {
			resp.status(404).json({ message: 'Cart not found' });
		}
	} catch (err) {
		resp.status(500).send({ message: 'Internal Server Error' });
	}
};

module.exports = { updateCart, getCart, deleteCart, addToCart };
