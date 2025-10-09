# Online_Store-Backend
A robust Node.js backend for an e-commerce platform with secure APIs and database management.

**Features**

User Authentication - JWT-based login/register with password encryption

Product Management - CRUD operations for products and categories

Shopping Cart - Add, update, remove items with quantity control

Wishlist System - Save and manage favorite products

Order Processing - Order creation, status tracking, and history

Security - Input validation, CORS, and secure endpoints

**Tech Stack**

Node.js - Runtime environment

Express.js - Web framework

MongoDB - NoSQL database

Mongoose - ODM for MongoDB

JWT - Authentication tokens

Bcrypt - Password hashing

CORS - Cross-origin resource sharing

**API Endpoints**

**Authentication**

POST /api/user/register - User registration

POST /api/user/login - User login

GET /api/user/profile - Get user profile

**Products**

GET /api/products - Get all products

GET /api/products/:id - Get single product

GET /api/products/category/:category - Get products by category

**Cart**

GET /api/user/cart - Get user cart

POST /api/user/cart - Add item to cart

PUT /api/user/cart - Update cart item quantity

DELETE /api/user/cart - Remove item from cart

**Wishlist**

GET /api/user/wishlist - Get user wishlist

POST /api/user/wishlist - Add/remove from wishlist

**Orders**

GET /api/user/orders - Get user orders

POST /api/user/orders - Create new order

GET /api/user/orders/:id - Get order details

PUT /api/user/orders/:id - Update order status

**How to Run**

**Prerequisites**

Node.js (version 16 or higher)

MongoDB (local or Atlas)

npm or yarn

**Installation & Setup**

**Install dependencies**

npm install

**Environment setup**

PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET_KEY=your_jwt_secret_key
NODE_ENV=development

**Start development server**

npm run dev

**Start production server**

npm start

**Database Models**

User - Authentication and profile data

Product - Product information and inventory

Cart - User shopping cart with items

Wishlist - User favorite products

Order - Order details and status

Backend API for full-stack e-commerce application with MongoDB database and secure RESTful endpoints.
