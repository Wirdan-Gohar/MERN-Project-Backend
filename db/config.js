const mongoose = require('mongoose');

try {
	mongoose.connect(
		'mongodb+srv://wirdan:pakistan@cluster0.3a1op15.mongodb.net/e-commerce?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			ssl: true, // Enable SSL
			sslValidate: true, // Validate SSL certificates
		}
	);

	const db = mongoose.connection;

	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.once('open', () => {
		console.log('Connected to MongoDB');
	});
} catch (error) {
	console.error('Error connecting to MongoDB:', error);
}
