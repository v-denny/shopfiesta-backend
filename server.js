const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Allows to read JSON data sent from React
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-vercel-domain.vercel.app'], // Allow your local Vite app and live Vercel app
    credentials: true
}));

// Basic test route
app.get('/', (req, res) => {
    res.send('ShopFiesta Backend is running!');
});

// Database Connection 
/*
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));
*/

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});