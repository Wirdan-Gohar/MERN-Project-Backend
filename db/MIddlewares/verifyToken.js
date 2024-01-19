const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
	// split is using to split barer and token and store the token in headerToken
	const headerToken = req.headers['authorization'].split(' ')[1];
	try {
		if (headerToken) {
			jwt.verify(headerToken, jwtSecreteKey, (err, decoded) => {
				if (err) {
					res.status(401).json({
						Error: err,
						success: false,
						message: 'Provide Valid Token',
					});
				} else next();
			});
		} else {
			res.status(401).json({ Error: 'Please Provide Token in Headers' });
		}
	} catch (error) {
		res.status(401).json({ Error: 'Please Provide Token in Headers' });
	}
}

module.exports = verifyToken;
