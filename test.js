const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let userData = {};

app.post('/v1/user', (req, res) => {
    const { id, username, first_name, last_name } = req.body;
    if (!id || !username || !first_name || !last_name) {
        return res.status(400).send('Missing required user data');
    }
    userData = { id, username, first_name, last_name };
    res.status(201).send(userData);
});

const basicAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).send('Authentication required');
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== userData.username || password !== 'testpassword') {
        return res.status(403).send('Access Denied');
    }
    next();
};

app.put('/v1/user/self', basicAuthMiddleware, (req, res) => {
    userData = { ...userData, ...req.body };
    res.status(200).send(userData);
});

app.get('/v1/user/self', basicAuthMiddleware, (req, res) => {
    res.status(200).send(userData);
});

module.exports = app;
