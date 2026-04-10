const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/sync-user', async (req, res) => {
    const { uid, email, displayName } = req.body;
    try {
        // Find user or create a new one if they don't exist
        const user = await User.findOneAndUpdate(
            { firebaseId: uid },
            { name: displayName || 'Anonymous', email: email },
            { new: true, upsert: true } // upsert: true creates it if not found
        );
        res.status(200).json({
            message: "User synced successfully",
            user: user
        });
    } catch (error) {
        console.error("Sync Error:", error);
        res.status(500).json({ message: "Sync failed", error });
    }
});

module.exports = router;