const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add to Cart
router.post('/add', async (req, res) => {
    const { uid, product } = req.body;
    try {
        const user = await User.findOne({ firebaseId: uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const itemIndex = user.cart.findIndex(p => p.productId === product.id);

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += 1;
        } else {
            user.cart.push({ 
                productId: product.id, 
                name: product.name, 
                price: product.price, 
                image: product.image, 
                quantity: 1 
            });
        }
        await user.save();
        res.status(200).json(user.cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/remove', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        const user = await User.findOne({ firebaseId: uid });
        // Filter out the item to delete it entirely
        user.cart = user.cart.filter(item => item.productId !== productId);
        await user.save();
        res.status(200).json(user.cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET /api/cart/:uid (Fetch cart on login)
router.get('/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseId: req.params.uid });
        if (!user) {
            return res.status(200).json([]); // Return empty cart if user is brand new
        }
        res.status(200).json(user.cart);
    } catch (err) {
        console.error("Error fetching cart:", err);
        res.status(500).json({ message: "Server error fetching cart" });
    }
});

module.exports = router;