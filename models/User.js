const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseId: {
        type: String,
        required: true,
        unique: true, // This ensures no two users have the same Firebase UID
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', // Most signups will be regular users
    },
    wishlist: [{
        type: String,
        ref: 'Product' // This links to your Product model (we'll build that next!)
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    cart: [{
        productId: String, // Since you use external APIs for now, store the ID as a string
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 }
    }],
});

module.exports = mongoose.model('User', userSchema);