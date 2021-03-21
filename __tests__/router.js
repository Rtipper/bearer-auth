  'use strict';

process.env.SECRET = "walrus";
const server = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const base64 = require('base-64')

const mockRequest = supergoose(server.app);

let users = {
  admin: { username: 'admin', password: 'password' },
  editor: { username: 'editor', password: 'password' },
  user: { username: 'user', password: 'password' },
};

describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} users`, () => {

      it('can create one', async () => {

        const response = await mockRequest.post('/signup').send(users[userType]);
        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject._id).toBeDefined();
        expect(userObject.username).toEqual(users[userType].username)

      });

      it('can signin with basic', async () => {
        let user = base64.encode(`${users[userType].username}:${users[userType].password}`)
        const response = await mockRequest.post('/signin')
          .set('auth', `Basic ${user}`); // sending through authentication headers to backend.. does not work..

        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.user.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username)

      });

      it('can signin with bearer', async () => {
        let user = base64.encode(`${users[userType].username}:${users[userType].password}`)
        // First, use basic to login to get a token
        const response = await mockRequest.post('/signin')
          .set('auth', `Basic ${user}`)
        const token = response.body.user.token;
        console.log('TOKEN==================', token)

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest.get('/admin')
          .set('auth', `Bearer ${token}`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(200);

      });

    });

    describe('bad logins', () => {
      it('basic fails with known user and wrong password ', async () => {
        let user = base64.encode('admin:xyz')
        const response = await mockRequest.post('/signin')
          .set('auth', `Basic ${user}`)
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();

      });

      it('basic fails with unknown user', async () => {
        let user = base64.encode('nobody:xyz')
        const response = await mockRequest.post('/signin')
          .set('auth', `Basic ${user}`)
        const userObject = response.body;

        expect(response.status).toBe(404);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined()

      });

      it('bearer fails with an invalid token', async () => {

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest.get('/admin')
          .set('auth', `Bearer foobar`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(404);

      })
    })
  });
});