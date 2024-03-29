const express = require('express');
require('./db/config');
const ProductRouter = require('./routes/productRoutes');
const UserRouter = require('./routes/userRoutes');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Backend is running Fine on PORT ::' + `${port}`);
});
app.use('/products', ProductRouter)
app.use(UserRouter)

app.listen(port, () => {
	console.log(`https://localhost:${port}`);
});
