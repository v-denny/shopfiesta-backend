const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
    const { uid } = req.body;
    try {
        const user = await User.findOne({ firebaseId: uid });
        
        // Calculate total from the cart saved in MongoDB
        const total = user.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const options = {
            amount: Math.round(total * 100 * 83), // Converting to Paise (Assuming USD to INR conversion if using FakeStore)
            currency: "INR",
            receipt: `order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;