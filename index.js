const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
app.use(express.json());
app.get('/', (req, res) => {
	res.send('Backend is running Fine');
});

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
