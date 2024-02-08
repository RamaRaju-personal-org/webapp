const express = require('express');
const userModelPromise = require('../../models/userModel');
const authenticateBasic = require('../../middleware/base64');

const router = express.Router();

const usernameRegex = /^[^@]+@(example\.com|gmail\.com|outlook\.com|.+\.edu)$/i;

router.post('/', async (req, res) => {
    try {
        const { username } = req.body;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ error: 'Username must end with @example.com, @gmail.com, @outlook.com, or any .edu domain.' });
        }

        const User = await userModelPromise;
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const newUser = await User.create(req.body);

        const userWithoutPassword = { ...newUser.get({ plain: true }) };
        delete userWithoutPassword.password;

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.put('/self', authenticateBasic, async (req, res) => {
    try {
        const { username } = req.body;
        if (username && !usernameRegex.test(username)) {
            return res.status(400).json({ error: 'Username must end with @example.com, @gmail.com, @outlook.com, or any .edu domain.' });
        }

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
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/self', authenticateBasic, async (req, res) => {
    try {
        const userWithoutPassword = { ...req.user.get({ plain: true }) };
        delete userWithoutPassword.password;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.all('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;
