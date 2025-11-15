/** @format */

const express = require('express');
const connectdb = require('./config/db.js');
const cors = require('cors');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoues');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes.js');
const wishlistRoutes = require('./routes/wishlistRoutes.js');

const app = express();
connectdb();
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173', // Allow requests from your React frontend
		credentials: true, // Allow cookies (if needed)
	})
);

//Catergory Routes
app.use('/api/category', categoryRoutes);

//Product Routes
app.use('/api/products', productRoutes);

// User Routes
app.use('/api/user', userRoutes);
 
//wishlist routes
app.use('/api/user', wishlistRoutes);

//Cart Routes
app.use('/api/cart', cartRoutes);

//Order Routes
app.use('/api/order', orderRoutes);

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});
