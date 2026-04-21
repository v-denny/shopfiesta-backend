const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add to Cart
router.post('/add', async (req, res) => {
    const { uid, product } = req.body;
    try {
        const user = await User.findOne({ firebaseId: uid });
        if (!user) return res.status(404).json({ message: "User not found" });

        const incomingProductIdStr = String(product._id || product.productId);

        const existingItemIndex = user.cart.findIndex(
            (item) => String(item.productId) === incomingProductIdStr
        );
        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += 1;
        } else {
            user.cart.push({ 
                productId: incomingProductIdStr, 
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
        user.cart = user.cart.filter(item => String(item.productId) !== productId);
        await user.save();
        res.status(200).json(user.cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Increment quantity
router.post('/increment', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { firebaseId: uid, "cart.productId": productId }, 
            { $inc: { "cart.$.quantity": 1 } },  
            { new: true }                  
        );
        if (!updatedUser) return res.status(404).json({ message: "User or item not found" });

        const itemIndex = updatedUser.cart.findIndex(p => p.productId === productId);

        if (itemIndex > -1) {
            updatedUser.cart[itemIndex].quantity += 1;
            updatedUser.markModified('cart');
            await updatedUser.save();
            res.status(200).json(updatedUser.cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Decrement quantity
router.post('/decrement', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        const user = await User.findOneAndUpdate(
    { firebaseId: uid, "cart.productId": productId, "cart.quantity": { $gt: 1 } },
    { $inc: { "cart.$.quantity": -1 } },
    { new: true }
);
        if (!user) return res.status(404).json({ message: "User or item not found" });

        const itemIndex = user.cart.findIndex(p => p.productId === productId);

        if (itemIndex > -1) {
            if (user.cart[itemIndex].quantity > 1) {
                user.cart[itemIndex].quantity -= 1;
            } else {
                // Remove item if quantity becomes 0
                user.cart.splice(itemIndex, 1);
            }
            await user.save();
            res.status(200).json(user.cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
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