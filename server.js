const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Backend is running Fine on PORT ::' + `${port}`);
});

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
