const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import your new model

// GET /api/products
router.get('/', async (req, res) => {
    try {
        // This tells MongoDB to find ALL products in the collection
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// GET /api/products/:id (Fetch single product by ID)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Failed to fetch product" });
    }
});

module.exports = router;