const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	confirmPassword: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
// module.exports = mongoose.model('users', userSchema);
