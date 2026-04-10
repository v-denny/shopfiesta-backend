const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Connect to Database logic
const connectDB = require('./config/db');

// 2. Import Routes using 'require'
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();

// 3. Connect to MongoDB
connectDB();

// 4. Middleware
app.use(express.json()); 
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-vercel-domain.vercel.app'], 
    credentials: true
}));

// 5. Use Routes
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('ShopFiesta Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});