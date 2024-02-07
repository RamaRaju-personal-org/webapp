const bcrypt = require('bcrypt');
const userModelPromise = require('../models/userModel');

const authenticateBasic = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    try {
        const User = await userModelPromise;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(403).json({ error: 'Incorrect password' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authenticateBasic;
