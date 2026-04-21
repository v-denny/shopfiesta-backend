const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add to Cart
router.post('/add', async (req, res) => {
    const { uid, product } = req.body;
    try {
        // Step 1: Try to increment the quantity if the product is already in the cart
        let user = await User.findOneAndUpdate(
            { firebaseId: uid, "cart.productId": product.id },
            { $inc: { "cart.$.quantity": 1 } },
            { new: true }
        );

        // Step 2: If the user exists but the product wasn't in the cart, push it as a new item
        if (!user) {
            user = await User.findOneAndUpdate(
                { firebaseId: uid },
                { 
                    $push: { 
                        cart: { 
                            productId: product.id, 
                            name: product.name, 
                            price: product.price, 
                            image: product.image, 
                            quantity: 1 
                        } 
                    } 
                },
                { new: true }
            );
        }

        // Step 3: If the user STILL doesn't exist, the uid is invalid
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.cart);
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Remove item entirely from cart
router.post('/remove', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        // Atomic $pull removes the object from the array without needing to fetch the whole document first
        const user = await User.findOneAndUpdate(
            { firebaseId: uid },
            { $pull: { cart: { productId: productId } } },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.cart);
    } catch (err) {
        console.error("Error removing from cart:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Increment quantity
router.post('/increment', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        // Atomic $inc safely increments the specific item's quantity
        const user = await User.findOneAndUpdate(
            { firebaseId: uid, "cart.productId": productId },
            { $inc: { "cart.$.quantity": 1 } },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User or item not found" });

        res.status(200).json(user.cart);
    } catch (err) {
        console.error("Error incrementing item:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Decrement quantity
router.post('/decrement', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        // Step 1: Try to decrement ONLY if the quantity is greater than 1
        let user = await User.findOneAndUpdate(
            { 
                firebaseId: uid, 
                cart: { $elemMatch: { productId: productId, quantity: { $gt: 1 } } } 
            },
            { $inc: { "cart.$.quantity": -1 } },
            { new: true }
        );

        // Step 2: If that failed, it means the quantity is 1 (or the item/user doesn't exist)
        // So we pull (remove) the item entirely.
        if (!user) {
            user = await User.findOneAndUpdate(
                { firebaseId: uid, "cart.productId": productId },
                { $pull: { cart: { productId: productId } } },
                { new: true }
            );
        }

        // Step 3: If user is STILL null, they either don't exist or the item was already gone
        if (!user) {
            // Let's do a quick check just to make sure the user exists before sending a 404
            const checkUser = await User.findOne({ firebaseId: uid });
            if (!checkUser) return res.status(404).json({ message: "User not found" });
            
            return res.status(404).json({ message: "Item not found in cart" });
        }

        res.status(200).json(user.cart);
    } catch (err) {
        console.error("Error decrementing item:", err);
        res.status(500).json({ message: "Internal server error" });
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
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;