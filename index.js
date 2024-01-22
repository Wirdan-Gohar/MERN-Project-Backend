const express = require('express');
require('./db/config');
const User = require('./db/Modals/Users');
const Product = require('./db/Modals/Products');
const verifyToken = require('./db/MIddlewares/verifyToken');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

jwtSecreteKey = 'Secrete-json-key-09&*823df74dfs434n34afd34o34as(#$';
tokenExpireTime = '5h';

app.get('/', (req, res) => {
	res.send('Backend is running Fine on PORT ::' + `${port}`);
});

// Create Products API
app.post('/add-product', verifyToken, async (req, res) => {
	try {
		const product = new Product(req.body);
		const result = await product.save();
		res.status(200).json({ result, message: 'Product Updated successfully' });
		// res.send(result);
	} catch (e) {
		console.log('e', e);
	}
});

// Read all products
app.get('/products', verifyToken, async (req, res) => {
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
		res.status(500).json({ error, message: 'Internal Server Error' });
	}
});

// GEt single Products
app.get('/product/:id', verifyToken, async (req, res) => {
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
app.put('/update-product/:id', verifyToken, async (req, res) => {
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

// Delete single Product
app.delete('/products/:id', verifyToken, async (req, res) => {
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
app.get('/search/', verifyToken, async (req, res) => {
	const regex = new RegExp(req.query.key, 'i'); // 'i' flag for case-insensitivity
	try {
		const products = await Product.find({ userID: req.query.id });
		if (!products || products.length === 0) {
			res.send([]); // No products found for the user
		} else {
			const result = products.filter(product => regex.test(product.name));
			res.send(result);
		}
	} catch (error) {
		res.status(500).send({ error: 'Internal Server Error' });
	}
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

			jwt.sign(
				{ savedUser },
				jwtSecreteKey,
				{ expiresIn: tokenExpireTime },
				(err, token) => {
					if (err) console.log('err', err);
					else {
						const user = {
							_id: savedUser._id,
							username: savedUser.username,
							email: savedUser.email,
							token: token,
						};
						// res.send({ savedUser, token: token });
						res.status(201).json({ user, token: token });
					}
				}
			);

			// res.status(201).json({
			// delete savedUser.password;
			// 	id: savedUser._id,
			// 	username: savedUser.username,
			// 	email: savedUser.email,
			// });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Login API
app.post('/login', async (req, res) => {
	if (req.body.email && req.body.password) {
		const user = await User.findOne(req.body).select('-password');
		if (user) {
			jwt.sign(
				{ user },
				jwtSecreteKey,
				{ expiresIn: tokenExpireTime },
				(err, token) => {
					err ? console.log('err', err) : res.send({ user, token });
				}
			);

			// if (token) res.send(user, { token: token });
			// res.send(user, { token: token });
		} else res.status(404).json({ error: 'Invalid Username or Password' });
	} else {
		res.status(404).json({ error: 'User Not Found' });
	}
});

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
