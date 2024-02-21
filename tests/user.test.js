const request = require('supertest');
const app = require('../test'); 
describe('/v1/user/self endpoint integration tests', () => {
    const username = 'testuser@example.com';
    const password = 'testpassword';
    const basicAuthToken = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    it('Test 1 - Create an account, and using the GET call, validate account exists', async () => {
        const newUser = {
            id: '1',
            username: 'testuser@example.com',
            first_name: 'Test',
            last_name: 'User'
        };

        // Create the account
        await request(app)
            .post('/v1/user')
            .send(newUser)
            .expect(201, newUser);

        // Validate the account exists
        await request(app)
            .get('/v1/user/self')
            .set('Authorization', basicAuthToken)
            .expect(200, newUser);
    });

    it('Test 2 - Update the account and using the GET call, validate the account was updated', async () => {
        const updatedFirstName = 'UpdatedTest';

        // Update the account
        await request(app)
            .put('/v1/user/self')
            .set('Authorization', basicAuthToken)
            .send({ first_name: updatedFirstName })
            .expect(200)
            .expect((res) => {
                expect(res.body.first_name).toBe(updatedFirstName);
            });

        // Validate the account was updated
        await request(app)
            .get('/v1/user/self')
            .set('Authorization', basicAuthToken)
            .expect(200)
            .expect((res) => {
                expect(res.body.first_name).toBe(updatedFirstName);
            });
    });
});
