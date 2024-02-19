const request = require('supertest');
const test = require('../test'); 

describe('/v1/user/self endpoint integration tests', () => {
    const username = 'testuser';
    const password = 'testpassword';
    const basicAuthToken = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    it('Test 1 - Validate account exists', async () => {
        const response = await request(test)
            .get('/v1/user/self')
            .set('Authorization', basicAuthToken);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('username', username);
    });

    it('Test 2 - Update the account and validate the account was updated', async () => {
        const updatedFirstName = 'UpdatedTest';
        
        let updateResponse = await request(test)
            .put('/v1/user/self')
            .set('Authorization', basicAuthToken)
            .send({ first_name: updatedFirstName });

        expect(updateResponse.statusCode).toBe(400);
        expect(updateResponse.body).toHaveProperty('first_name', updatedFirstName);

        const fetchResponse = await request(test)
            .get('/v1/user/self')
            .set('Authorization', basicAuthToken);

        expect(fetchResponse.statusCode).toBe(200);
        expect(fetchResponse.body).toHaveProperty('first_name', updatedFirstName);
    });
});
