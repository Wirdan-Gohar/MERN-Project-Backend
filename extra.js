const express = require('express');
// const mongoose = require('mongoose');
const app = express();
const port = 5000;

// const connectDB = async () => {
// 	mongoose.connect('mongodb://localhost:27017//e-comm');
// 	const productSchema = new mongoose.Schema({});
// 	const product = mongoose.model('products', productSchema);
// 	const data = await product.find();
// };

// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });
connectDB();

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
