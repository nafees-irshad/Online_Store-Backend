/** @format */

const Cart = require('../models/cartModel');
const Product = require('../models/productsModel');

//add to cart

const addToCart = async (req, res) => {
	const { productId, quantity } = req.body; // Changed from 'qty' to 'quantity'
	const userId = req.user.id;

	try {
		// Validate input
		if (!productId) {
			return res.status(400).json({
				status: 'Failed',
				message: 'Invalid product ID or quantity',
			});
		}

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

		// Check if requested quantity is available
		if (product.qty < quantity) {
			return res.status(400).json({
				status: 'Failed',
				message: `Only ${product.qty} items available in stock`,
			});
		}

		let cart = await Cart.findOne({ userId });

		if (!cart) {
			// Create new cart
			const newCart = new Cart({
				userId,
				products: [
					{
						productId,
						quantity: quantity || 1,
					},
				],
			});
			await newCart.save();

			return res.status(200).json({
				status: 'Success',
				message: 'Product added to cart',
			});
		} else {
			// Check if product already exists in cart
			const existingProductIndex = cart.products.findIndex(
				(item) => item.productId.toString() === productId
			);
			if (existingProductIndex > -1) {
				// Product exists, increment quantity
				const newQuantity =
					cart.products[existingProductIndex].quantity + (quantity || 1);

				// Check if total quantity exceeds available stock
				if (newQuantity > product.qty) {
					return res.status(400).json({
						status: 'Failed',
						message: `Cannot add more than available stock (${product.qty})`,
					});
				}

				cart.products[existingProductIndex].quantity = newQuantity;
			} else {
				// Product doesn't exist, add new product
				cart.products.push({
					productId,
					quantity: quantity || 1,
				});
			}

			await cart.save();

			return res.status(200).json({
				status: 'Success',
				message:
					existingProductIndex > -1
						? 'Product quantity updated'
						: 'Product added to cart',
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
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
const getCart = async (req, res) => {
	const userId = req.user.id;

	try {
		const cart = await Cart.findOne({ userId }).populate(
			'products.productId',
			'name price'
		);

		if (!cart) {
			return res.status(200).json({
				status: 'Success',
				message: 'Cart is empty',
				cart: { products: [] },
			});
		}

		res.status(200).json({
			status: 'Success',
			cart: cart,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: 'Failed',
			message: 'Internal server error',
		});
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
