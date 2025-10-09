/** @format */

const Product = require('../models/productsModel');

const createProducts = async (req, resp) => {
	const product = req.body;
	try {
		const products = await Product.insertMany(product);
		resp.status(201).json(products);
	} catch (err) {
		console.log(err);
		resp.status(500).json({ message: 'error creating document' });
	}
};

const updateProducts = async (req, res) => {
	const { _id } = req.params;
	const updates = req.body;

	try {
		const product = await Product.findByIdAndUpdate(_id, updates, {
			new: true,
			runValidators: true,
		});
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json({ message: 'Product updated successfully', product });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
const productDetails = async (req, resp) => {
	const id = req.params;
	try {
		const product = await Product.findById(id);
		if (!product) {
			return resp.status(404).json({
				message: 'Porduct not found',
			});
		}

		resp.status(200).json(product);
	} catch (err) {
		resp.status(500).send({ message: 'Internal Server Error' });
	}
};
 
//get all products details
const getAllProducts = async (req, resp) => {
	try {
		const products = await Product.find();
		resp.status(200).json(products);
	} catch (error) {
		resp.status(500).json({ message: 'Error fetching products' });
	}
};

const deleteProduct = async (req, resp) => {
	const id = req.params;
	try {
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			return resp.status(404).json({
				message: 'Porduct not found',
			});
		}
		resp.status(200).json({ 'product deleted successfully': product });
	} catch (err) {
		resp.status(500).send({ message: 'Internal Server Error' });
	}
};

module.exports = {
	createProducts,
	updateProducts,
	productDetails,
	deleteProduct,
	getAllProducts,
};
