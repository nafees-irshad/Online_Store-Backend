/** @format */

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userRegistration = async (req, resp) => {
	const { name, email, password } = req.body;
	console.log(req.body);
	const user = await User.findOne({ email: email });

	if (user) {
		return resp.status(400).json({
			status: 'failed',
			message: 'Email already exists.',
		});
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const newUserDoc = new User({
			name: name,
			email: email,
			password: hashPassword,
		});

		await newUserDoc.save();

		// Generate JWT token
		const token = jwt.sign(
			{ userId: newUserDoc._id }, // Payload (user ID)
			process.env.JWT_SECRET_KEY, // Secret key (store securely)
			{ expiresIn: '1d' } // Token expiration (optional)
		);

		resp.status(200).json({
			message: 'User registered.',
			token: token, // Send the token in the response
		});
	} catch (err) {
		console.error(err);
		resp.status(500).json({
			status: 'failed',
			message: 'Error in registration',
		});
	}
};

const userLogin = async (req, resp) => {
	const { email, password } = req.body;
	console.log(req.body);

	// check user availablity by email
	const user = await User.findOne({ email: email });
	if (!user) {
		return resp.status(400).json({
			status: 'failer',
			message: 'Email not exist',
		});
	}

	// validating password
	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return resp.status(400).json({
			status: 'failed',
			message: 'Invalid password.',
		});
	}

	try {
		//generate token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: '5d',
		});
		console.log(token);
		resp.send({
			status: 'success',
			message: 'User logged in successfully',
			token: token,
		});
	} catch (err) {
		console.log(err);
		resp.send({ status: 'failed', message: 'login error' });
	}
};

const changePassword = async (req, resp) => {
	const { currentPassword, newPassword } = req.body;

	try {
		const user = await User.findById(req.user._id);
		// Validate Password
		const isValidPassword = await bcrypt.compare(
			currentPassword,
			user.password
		);
		if (!isValidPassword) {
			return resp.status(400).json({
				status: 'failed',
				message: 'Wrong password',
			});
		}
		//Generate new password
		const salt = await bcrypt.genSalt(10);
		const newHashPassword = await bcrypt.hash(newPassword, salt);

		user.password = newHashPassword;
		await user.save();
		resp.send({
			status: 'sucess',
			message: 'Password changed successfully',
		});
	} catch (err) {
		console.log(err);
		resp.status(500).json({
			status: 'failed',
			message: 'Error changing password',
		});
	}
}; 

const updateUser = async (req, resp) => {
	const updates = req.body;

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.user._id,
			{ $set: updates },
			{ new: true, runValidators: true }
		).select('-password');

		resp.status(200).json({
			status: 'success',
			message: 'User updated successfully',
			data: updatedUser,
		});

		if (!updatedUser) {
			return resp.status(404).json({
				status: 'failed',
				message: 'User not found',
			});
		}
	} catch (err) {
		console.error(err);
		resp.status(500).json({
			status: 'failed',
			message: 'An error occurred while updating the user',
		});
	}
};

const viewProfile = async (req, resp) => {
	const id = req.user.id;
	try {
		const user = await User.findById(id);
		if (user) {
			resp.status(200).json({
				status: 'success',
				message: 'user fetched successfully',
				data: {
					id: user._id,
					name: user.name,
					email: user.email,
					address: user.address,
				},
			});
		} else {
			resp.status(404).json({
				status: 'failed',
				message: 'User not found',
			});
		}
	} catch (err) {
		console.error(err);
		resp.status(500).json({
			message: 'internal server error',
		});
	}
};

module.exports = {
	userRegistration,
	userLogin,
	changePassword,
	updateUser,
	viewProfile,
};
