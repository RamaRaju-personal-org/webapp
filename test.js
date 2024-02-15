const express = require('express');
const bodyParser = require('body-parser');
const test = express();

test.use(bodyParser.json());

let userData = {
    id: '1',
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User'
};

const basicAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).send('Authentication required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== 'testuser' || password !== 'testpassword') {
        return res.status(403).send('Access Denied');
    }

    next();
};

test.put('/v1/user/self', basicAuthMiddleware, (req, res) => {
    userData = { ...userData, ...req.body };
    res.status(200).send(userData);
});

test.get('/v1/user/self', basicAuthMiddleware, (req, res) => {
    res.status(200).send(userData);
});

module.exports = test;
