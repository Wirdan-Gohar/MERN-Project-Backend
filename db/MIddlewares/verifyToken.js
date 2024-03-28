const jwt = require('jsonwebtoken');
jwtSecreteKey = 'Secrete-json-key-09&*823df74dfs434n34afd34o34as(#$';

function verifyToken(req, res, next) {
	// split is using to split barer and token and store the token in headerToken
	const headerToken = req.headers['authorization'];
	try {
		if (headerToken) {
			const splitToken = headerToken.split(' ')[1];
			jwt.verify(splitToken, jwtSecreteKey, (err, decoded) => {
				if (err) {
					res.status(401).json({
						Error: err,
						success: false,
						message: 'Provide Valid Token',
					});
				} else {
					const decodedToken = jwt.verify(splitToken, jwtSecreteKey); // Replace 'your_secret_key' with your actual secret key
					req.userID = decodedToken.user._id;
					next();
				}
			});
		} else {
			res.status(401).json({ Error: 'Please Provide Token in Headers' });
		}
	} catch (error) {
		res.status(401).json({ Error: 'Authorization header is missing' });
	}
}

module.exports = verifyToken;
