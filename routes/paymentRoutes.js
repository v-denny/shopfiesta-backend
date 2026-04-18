const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Initialize Stripe with your Secret Key from .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
    const { uid, client_url } = req.body; // Firebase UID from frontend

    try {
        // 1. Get user and their cart from MongoDB
        const user = await User.findOne({ firebaseId: uid }).populate('cart.productId');
        
        if (!user || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        
        const allowedDomains = [
            'http://localhost:5173', 
            process.env.CLIENT_URL // Your live Vercel/Netlify URL
        ];
        
        const safe_url = allowedDomains.includes(client_url) 
            ? client_url 
            : process.env.CLIENT_URL;

        // 2. Map cart items to Stripe format
       const validCartItems = user.cart.filter(item => item.productId);
        const line_items = validCartItems.map((item) => {
            const itemPrice = Number(item.productId.price) || 0; 

            return {
                price_data: {
                    currency: 'usd', 
                    product_data: {
                        // FIX: Changed .name to .title to match your Product schema!
                        name: item.productId.title || 'Festive Item', 
                    },
                    unit_amount: Math.round(itemPrice * 100), // Safely converted to cents
                },
                quantity: item.quantity,
            };
        });

        // 3. Create the Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            // Pass the Firebase UID in metadata so the Webhook knows who paid
            metadata: { firebaseId: uid }, 
            success_url: `${safe_url}/success`,
            cancel_url: `${safe_url}/cart`,
        });

        // 4. Send the URL to the frontend
        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error("Stripe Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;