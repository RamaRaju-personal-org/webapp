// user.js

const express = require('express');
const userModelPromise = require('../../models/userModel');
const authenticateBasic = require('../../middleware/base64');
const logger = require('./../../logger'); // Ensure the path to logger.js is correct

const router = express.Router();

// Define your username regex
const usernameRegex = /^[^@]+@(example\.com|gmail\.com|outlook\.com|.+\.edu)$/i;

router.post('/', async (req, res) => {
    try {
        const { username } = req.body;
        if (!usernameRegex.test(username)) {
            logger.error({ message: 'Invalid username pattern', username: username });
            return res.status(400).json({ error: 'Username must end with @example.com, @gmail.com, @outlook.com, or any .edu domain.' });
        }

        const User = await userModelPromise;
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            logger.error({ message: 'User already exists', username: username });
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const newUser = await User.create(req.body);

        const userWithoutPassword = { ...newUser.get({ plain: true }) };
        delete userWithoutPassword.password;

        logger.info({ message: 'New user created', user: userWithoutPassword });
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        logger.error({ message: 'Error in POST /', error: error.message });
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.put('/self', authenticateBasic, async (req, res) => {
    try {
        const { username } = req.body;
        if (username && !usernameRegex.test(username)) {
            logger.error('Invalid username pattern: ' + username);
            return res.status(400).json({ error: 'Username must end with @example.com, @gmail.com, @outlook.com, or any .edu domain.' });
        }

        if (Object.keys(req.body).length === 0 || 
        Object.keys(req.body).every(key => ['username', 'id', 'createdAt', 'updatedAt'].includes(key))) {
        logger.info({ message: 'No content for update or attempted to update restricted fields', username: req.user.username });
        return res.status(204).end(); // No content to update or attempted restricted field update
    }
        
        const authenticatedUser = req.user;
        
        const disallowedUpdates = ['username', 'id', 'createdAt', 'updatedAt'];
        const attemptedUpdates = Object.keys(req.body);
        const isInvalidUpdate = attemptedUpdates.some(update => disallowedUpdates.includes(update));

        if (isInvalidUpdate) {
            logger.warn({ message: 'Attempted to update restricted fields', attemptedUpdates: attemptedUpdates });
            return res.status(400).json({ error: 'Attempt to update restricted field(s).' });
        }

        await authenticatedUser.update(req.body);
        const updatedUserWithoutPassword = { ...authenticatedUser.get({ plain: true }) };
        delete updatedUserWithoutPassword.password;

        logger.info({ message: 'User updated', user: updatedUserWithoutPassword });
        // res.json(updatedUserWithoutPassword);
        return res.status(204).end();
    } catch (error) {
        logger.error({ message: 'Error in PUT /self', error: error.message });
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/self', authenticateBasic, async (req, res) => {
    try {
        const userWithoutPassword = { ...req.user.get({ plain: true }) };
        delete userWithoutPassword.password;

        logger.info({ message: 'User data retrieved', user: userWithoutPassword });
        res.json(userWithoutPassword);
    } catch (error) {
        logger.error({ message: 'Error in GET /self', error: error.message });
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.all('*', (req, res) => {
    logger.warn({ message: 'Invalid path', path: req.path });
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;
