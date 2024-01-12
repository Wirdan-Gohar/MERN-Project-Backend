const express = require('express');
app.use(express.json());
app.get('/', (req, res) => {
	res.send('Backend is running Fine');
});
