const express = require('express')
const router = express.Router()
const User = require('../db/Modals/Users');
const jwt = require('jsonwebtoken');

jwtSecreteKey = 'Secrete-json-key-09&*823df74dfs434n34afd34o34as(#$';
tokenExpireTime = '5h';
// Register
router.post('/register', async (req, res) => {
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                error: 'Email already exists. Please choose a different email.',
            });
        } else {
            const newUser = new User(req.body);
            const savedUser = await newUser.save();
            // savedUser = savedUser.toObject();
            jwt.sign({ savedUser }, jwtSecreteKey, { expiresIn: tokenExpireTime }, (err, token) => {
                if (err) console.log('err', err);
                else {
                    const user = {
                        _id: savedUser._id,
                        username: savedUser.username,
                        email: savedUser.email,
                        // token: token,
                    };
                    // res.send({ savedUser, token: token });
                    res.status(201).json({ user, token: token });
                }
            }
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login API
router.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        const user = await User.findOne(req.body).select('-password -__v');
        if (user) {
            jwt.sign(
                { user },
                jwtSecreteKey,
                { expiresIn: tokenExpireTime },
                (err, token) => {
                    err ? console.log('err', err) : res.send({ user, token });
                }
            );

            // if (token) res.send(user, { token: token });
            // res.send(user, { token: token });
        } else res.status(404).json({ error: 'Invalid Username or Password' });
    } else {
        res.status(404).json({ error: 'User Not Found' });
    }
});

module.exports = router;