const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
	name: String,
	price: String,
	category: String,
	userID: String,
	company: String,
});

const Product = mongoose.model('Products', productSchema);
module.exports = Product;
// module.exports = mongoose.model('users', userSchema);
