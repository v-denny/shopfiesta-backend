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
    wishlist: {
      type:  [{
        type: String,
        ref: 'Product' ,
        }], default: [] 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    cart: {
        type: [{
        productId: String, // for external APIs store the ID as a string
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 }
    }], default: []
    }
});

module.exports = mongoose.model('User', userSchema);