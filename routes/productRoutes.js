const Product = require('../db/Modals/Products');
const verifyToken = require('../db/MIddlewares/verifyToken');
const express = require('express')
const router = express.Router()

// now '/' means /products and if you want to add so it will be /add which means /products/add

// Search API /products/search/
router.get('/search/', verifyToken, async (req, res) => {
    const userID = req.userID; // Get user ID from from Headers in verifyToken Middleware
    const regex = new RegExp(req.query.key, 'i'); // 'i' flag for case-insensitivity
    try {
        const products = await Product.find({ userID: userID }).select('-_id -__v');  //get All details except _id and __v
        if (!products || products.length === 0) {
            res.send([]); // No products found for the user
        } else {
            const data = products.filter(product => regex.test(product.name));
            res.status(200).json({ data, message: 'Product Fetched successfully' });
            // res.send(result);
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
// Read all products /products
router.get('/', verifyToken, async (req, res) => {
    try {
        const userID = req.userID; // Get user ID from from Headers in verifyToken Middleware
        // const userID = req.query.userId; //Get user ID from frontend params
        if (!userID) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // find products for relevant user that is loggedIn
        const products = await Product.find({ userID: userID });
        res.status(200).json({ products, message: 'Product Fetched successfully' });
    } catch (error) {
        res.status(500).json({ error, message: 'Internal Server Error' });
    }
});
// Create Products API /products/add
router.post('/add', verifyToken, async (req, res) => {
    try {
        const userID = req.userId;
        // Add userId to req.body
        req.body.userID = userID;

        const product = new Product(req.body);
        const result = await product.save();
        res.status(200).json({ result, message: 'Product Updated successfully' });
        // res.send(result);
    } catch (e) {
        console.log('e', e);
    }
});
// Update single Product
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body;
        // Check if the product exists
        const existingProduct = await Product.findById(productId);

        if (existingProduct) {
            // Update the product
            const result = await Product.updateOne(
                { _id: productId },
                { $set: updatedData }
            );
            res
                .status(200)
                .json({ updatedData, message: 'Product Updated successfully' });
        } else {
            return res.status(404).json({ message: 'Product not Exist' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error, message: 'Internal Server Error' });
    }
});
// Delete single Product /products/:id
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        // Check if the product exists
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Delete the product
        await existingProduct.deleteOne({ _id: productId });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// GEt single Products /products/:id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        // Check if the product exists
        const data = await Product.findById(req.params.id);
        if (data) {
            res.status(200).json({ data, message: 'Product Fetched successfully' });
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router