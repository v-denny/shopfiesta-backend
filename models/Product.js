const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: String,
    price: Number,
    image: String,
    category: String,
    rating: {
        rate: Number,
        count: Number
    }
});

module.exports = mongoose.model('Product', productSchema);