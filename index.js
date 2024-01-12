const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
app.get('/', (req, res) => {
	res.send('Backend is running Fine');
});
// Create Products API

// app.get('/register', (req, res) => {
// 	res.send(req.body);
// });

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
