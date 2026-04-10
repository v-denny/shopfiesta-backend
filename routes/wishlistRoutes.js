const express = require('express');
const router = express.Router();
const User = require('../models/User');

// TOGGLE Wishlist (Add if not there, remove if it is)
router.post('/toggle', async (req, res) => {
    const { uid, productId } = req.body;
    try {
        const user = await User.findOne({ firebaseId: uid });
        
        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            // Product exists, remove it
            user.wishlist.splice(index, 1);
        } else {
            // Product doesn't exist, add it
            user.wishlist.push(productId);
        }
        
        await user.save();
        res.status(200).json(user.wishlist);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;