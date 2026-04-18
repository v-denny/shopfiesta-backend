const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/sync-user', async (req, res) => {
    const { uid, email, displayName } = req.body;
    try {
        // Find user or create a new one if they don't exist
        const user = await User.findOneAndUpdate(
            { email: email }, // Find the user by their email
            { 
                $set: { 
                    firebaseId: uid, // Update their Firebase ID in case it changed
                    name: displayName 
                } 
            },
            { new: true, upsert: true, returnDocument: 'after' } // upsert: true creates it if not found
        );
        res.status(200).json(user);
    } catch (error) {
        console.error("Sync Error:", error);
        res.status(500).json({ message: "Sync failed" });
    }
});

module.exports = router;