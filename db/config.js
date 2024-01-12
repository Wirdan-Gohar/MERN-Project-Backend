const mongoose = require('mongoose');

mongoose.connect(
	// 'mongodb+srv://wirdan:pakistan@cluster0.3a1op15.mongodb.net/e-commerce?retryWrites=true&w=majority'
	'mongodb+srv://wirdan:pakistan@cluster0.3a1op15.mongodb.net/?retryWrites=true&w=majority'
);
// mongoose.connect(
// 	'mongodb+srv://wirdan:pakistan@cluster0.3a1op15.mongodb.net/e-commerce?retryWrites=true&w=majority'
// );
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
});
