const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Initialize Stripe with your Secret Key from .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
    const { uid } = req.body; // Firebase UID from frontend

    try {
        // 1. Get user and their cart from MongoDB
        const user = await User.findOne({ firebaseId: uid }).populate('cart.productId');
        
        if (!user || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2. Map cart items to Stripe format
       const validCartItems = user.cart.filter(item => item.productId);
        const line_items = user.cart.map((item) => ({
            price_data: {
                currency: 'usd', // Change to 'inr' if you prefer
                product_data: {
                    name: item.productId.name,
                    // images: [item.image], // Optional: add product images
                },
                unit_amount: Math.round(item.productId.price * 100), // Stripe uses cents ($20.00 = 2000)
            },
            quantity: item.quantity,
        }));

        // 3. Create the Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            // Pass the Firebase UID in metadata so the Webhook knows who paid
            metadata: { firebaseId: uid }, 
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
        });

        // 4. Send the URL to the frontend
        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error("Stripe Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;