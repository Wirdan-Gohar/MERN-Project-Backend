const express = require('express');
require('./db/config');
const User = require('./db/Modals/Users');
const Product = require('./db/Modals/Products');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
	res.send('Backend is running Fine');
});
// Create Products API
app.post('/add-products', async (req, res) => {
	try {
		const product = new Product(req.body);
		const result = await product.save();
		res.send(result);
	} catch (e) {
		console.log('e', e);
	}
});
// Read all products
app.get('/products', async (req, res) => {
	try {
		// find products for relevant user that is loggedIn
		const userId = req.query.userId;
		if (!userId) {
			return res.status(400).json({ error: 'User ID is required' });
		}
		const products = await Product.find({ userID: userId });
		// res.send(products);
		res.status(200).json({ products, message: 'Product Fetched successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
// GEt single Product
app.get('/products/:id', async (req, res) => {
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
// Update single Product
app.put('/update-product/:id', async (req, res) => {
	try {
		const productId = req.params.id;
		// Check if the product exists
		const existingProduct = await Product.findById(productId);

		if (existingProduct) {
			// Update the product
			// const result = await Product.updateOne(
			const result = await Product.updateOne(
				{ _id: productId },
				{ $set: req.body }
			);
			// const data = await result.json();
			res.status(200).json({ message: 'Product Updated successfully' });
		} else {
			return res.status(404).json({ message: 'Product not Exist' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error, message: 'Internal Server Error' });
	}
});
// Delete single Product
app.delete('/products/:id', async (req, res) => {
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

// Search API
app.get('/search/:key', async (req, res) => {
	const result = await Product.find({
		$or: [
			{
				name: { $regex: req.params.key },
			},
		],
	});
	res.send(result);
});

// Register
app.post('/register', async (req, res) => {
	try {
		// Check if the email already exists
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(400).json({
				error: 'Email already exists. Please choose a different email.',
			});
		} else {
			const newUser = new User(req.body);
			const savedUser = await newUser.save();
			// savedUser = savedUser.toObject();
			// delete savedUser.password;
			res.status(201).json({
				id: savedUser._id,
				username: savedUser.username,
				email: savedUser.email,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
app.post('/login', async (req, res) => {
	if (req.body.email && req.body.password) {
		const user = await User.findOne(req.body).select('-password');
		user
			? res.send(user)
			: res.status(404).json({ error: 'Invalid Username or Password' });
	} else {
		res.status(404).json({ error: 'User Not Found' });
	}
});
// app.get('/register', (req, res) => {
// 	res.send(req.body);
// });

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
