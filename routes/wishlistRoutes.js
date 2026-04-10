const express = require('express');
const router = express.Router();
const User = require('../models/User');

// TOGGLE Wishlist (Add if not there, remove if it is)
router.post('/toggle', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        const user = await User.findOne({ firebaseId: uid });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const productIdStr = String(productId);
        const index = user.wishlist.indexOf(productIdStr);
        if (index > -1) {
            // Product exists, remove it
            user.wishlist.splice(index, 1);
        } else {
            // Product doesn't exist, add it
            user.wishlist.push(productIdStr);
        }
        
        await user.save();
        res.status(200).json(user.wishlist);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET /api/wishlist/:uid (Fetch wishlist on login)
router.get('/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseId: req.params.uid });
        if (!user) {
            return res.status(200).json([]); // Return empty wishlist if user is brand new
        }
        // Ensure all items are strings
        const wishlist = user.wishlist.map(id => String(id));
        res.status(200).json(wishlist);
    } catch (err) {
        console.error("Error fetching wishlist:", err);
        res.status(500).json({ message: "Server error fetching wishlist" });
    }
});

module.exports = router;