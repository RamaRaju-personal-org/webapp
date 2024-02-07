// user.js
const express = require('express');
const userModelPromise = require('../../models/userModel');
const authenticateBasic = require('../../middleware/base64');

const router = express.Router();

// Register a new user
router.post('/', async (req, res) => {
    try {
        const User = await userModelPromise;
        const existingUser = await User.findOne({ where: { username: req.body.username } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        // The password hashing is handled in the model's setter
        const newUser = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
        });

        const userWithoutPassword = { ...newUser.get({ plain: true }) };
        delete userWithoutPassword.password;

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
});

// Update existing user's information
router.put('/self', authenticateBasic, async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(204).end();
        }
        const authenticatedUser = req.user;

        const disallowedUpdates = ['username', 'id', 'createdAt', 'updatedAt'];
        const attemptedUpdates = Object.keys(req.body);
        const isInvalidUpdate = attemptedUpdates.some(update => disallowedUpdates.includes(update));

        if (isInvalidUpdate) {
            return res.status(400).json({ error: 'Attempt to update restricted field(s).' });
        }

        await authenticatedUser.update(req.body);
        const updatedUserWithoutPassword = { ...authenticatedUser.get({ plain: true }) };
        delete updatedUserWithoutPassword.password;

        res.json(updatedUserWithoutPassword);
    } catch (error) {
        next(error);
    }
});

// Retrieve authenticated user's information
router.get('/self', authenticateBasic, async (req, res) => {
    try {
        const userWithoutPassword = { ...req.user.get({ plain: true }) };
        delete userWithoutPassword.password;
        res.json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
});

// Catch-all for unsupported routes
router.all('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;
