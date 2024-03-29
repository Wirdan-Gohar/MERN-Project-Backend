const express = require('express');
require('./db/config');
const ProductRouter = require('./routes/productRoutes');
const Product = require('./db/Modals/Products');
const verifyToken = require('./db/Middlewares/verifyToken.js');
// for user routes 
const User = require('./db/Modals/Users');
const jwt = require('jsonwebtoken');

jwtSecreteKey = 'Secrete-json-key-09&*823df74dfs434n34afd34o34as(#$';
tokenExpireTime = '5h';
// const UserRouter = require('./routes/userRoutes');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Backend is running Fine on PORT ::' + `${port}`);
});
// app.use('/products', ProductRouter)
// app.use(UserRouter)

// Login API
app.post('/login', async (req, res) => {
	if (req.body.email && req.body.password) {
		const user = await User.findOne(req.body).select('-password -__v');
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
// Register API 
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
			jwt.sign({ savedUser }, jwtSecreteKey, { expiresIn: tokenExpireTime }, (err, token) => {
				if (err) console.log('err', err);
				else {
					const user = {
						_id: savedUser._id,
						username: savedUser.username,
						email: savedUser.email,
						// token: token,
					};
					// res.send({ savedUser, token: token });
					res.status(201).json({ user, token: token });
				}
			}
			);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Read all products /products
app.get('/products', verifyToken, async (req, res) => {
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

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
