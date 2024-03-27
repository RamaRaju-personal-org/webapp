// user.js

const express = require('express');
const userModelPromise = require('../../models/userModel');
const authenticateBasic = require('../../middleware/base64');
const logger = require('./../../logger'); // Ensure the path to logger.js is correct

const emailVerificationModelPromise = require('../../models/EmailVerification'); // Ensure this path is correct


const router = express.Router();


// Middleware to check if the user is verified
async function isVerified(req, res, next) {
    try {
        const { id } = req.user; // ID from authenticated user

        const EmailVerification = await emailVerificationModelPromise;
        const verificationRecord = await EmailVerification.findOne({ where: { userId: id } });

        if (verificationRecord && verificationRecord.verified) {
            return next();
        }
        res.status(403).json({ error: 'Your account has not been verified.' });
    } catch (error) {
        logger.error({ message: 'Error checking verification status', error: error });
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



//publishing the message to pub/sub topic

const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub();
const topicName = 'verify_email'; // Replace with your Pub/Sub topic name


async function publishMessageToPubSub(message) {
    try {
        await pubsub.topic(topicName).publishJSON(message);
        console.log('Message published to Pub/Sub topic successfully');
    } catch (error) {
        console.error('Error publishing message to Pub/Sub topic:', error);
        throw error;
    }
}
/////////////////////////////////



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

        // Publish the event to the Pub/Sub topic
        await publishMessageToPubSub(userWithoutPassword);

        
        res.status(201).json(userWithoutPassword);


        const EmailVerification = await emailVerificationModelPromise;
        await EmailVerification.create({
            userId: newUser.id,
            email: newUser.username, // Assuming username is the email
        });
                 
        logger.info({ message: 'New user created', user: userWithoutPassword });
    } catch (error) {
        // logger.error({ message: 'Error in POST /', error: error.message });
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.put('/self', authenticateBasic, isVerified, async (req, res) => {
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
        
        return res.status(204).end();
    } catch (error) {
        logger.error({ message: 'Error in PUT /self', error: error.message });
        res.status(503).json({ error: 'Service Unavailable' });
    }
});

router.get('/self', authenticateBasic, isVerified, async (req, res) => {
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


router.get('/verify/:id', async (req, res) => {
    try {
        const User = await userModelPromise;
        const EmailVerification = await emailVerificationModelPromise;

        // Retrieve the user ID from the request parameters.
        const { id } = req.params;

        // Find the user by the ID provided in the URL.
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send('User not found. Verification link is invalid.');
        }

        // Find the verification record for this user.
        const verificationRecord = await EmailVerification.findOne({ where: { userId: id } });

        if (!verificationRecord) {
            return res.status(404).send('Verification record not found. Link may be invalid.');
        }

        // Check if the verification link has expired (2 minutes = 120000 milliseconds).
        if (new Date() - new Date(verificationRecord.sentAt) > 120000) {
            return res.status(400).send('Verification link has expired.');
        }
        // If the user is already verified, send an appropriate message.
        if (verificationRecord.verified) {
            return res.status(200).send('User is already verified.');
        }

        // Verify the user
        await verificationRecord.update({ verified: true });

        // Send a successful verification message.
        res.send('User is verified');
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).send('Internal Server Error');
    }
});

  


router.all('*', (req, res) => {
    logger.warn({ message: 'Invalid path', path: req.path });
    res.status(404).json({ error: 'Not Found' });
});




module.exports = router;
