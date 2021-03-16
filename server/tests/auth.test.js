require('dotenv').config();

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const db = require('../models');
const jwt = require('jsonwebtoken');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    username: 'Test',
    email: 'test@example.com',
    password: 'password'
};
const userOneToken = jwt.sign({ 
    id: userOneId, 
    username: userOne.username 
}, process.env.SECRET_KEY);

afterAll(async () => {
    await mongoose.connection.close();
});

describe('/POST register', () => {
    afterAll(async () => {
        await db.User.findByIdAndDelete(userOneId);
    });

    it('Should register a new user and return the id and username', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                ...userOne
            })
            .expect(201);
        const user = await db.User.findById(userOneId);
        expect(user).not.toBeNull();
        expect(response.body).toMatchObject({
            id: userOneId.toString(),
            username: userOne.username.toLowerCase()
        });
    });

    it('Should not store an unhashed password', async () => {
        const user = await db.User.findById(userOneId);
        expect(user.password).not.toBe('password');
    });

    it('Should not register an existing user', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                ...userOne
            })
            .expect(400);
        const numUsers = await db.User.countDocuments({
            email: userOne.email
        });
        expect(numUsers).toBe(1);
    });

    it('Should return that an existing username is taken', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: userOne.username,
                email: 'bob@bob.com',
                password: '123456'
            });
        expect(response.body.error.message).toContain('username');
    });

    it('Should return that an existing email is taken', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'bob',
                email: userOne.email,
                password: '123456'
            });
        expect(response.body.error.message).toContain('email');
    });

    it('Should not register a user with a password less than 6 chars', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: 'Bob',
                email: 'Bob@example.com',
                password: '12345'
            })
            .expect(400);
    });
});

describe('/POST login', () => {
    afterAll(async () => {
        await db.User.findByIdAndDelete(userOneId);
    });

    it('Should log in an existing user and return the id and username', async () => {
        await new db.User(userOne).save();
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: userOne.email,
                password: userOne.password
            })
            .expect(200);
        expect(response.body).toMatchObject({
            id: userOneId.toString(),
            username: userOne.username.toLowerCase()
        });
    });

    it('Should not log in a non-existing user', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                email: 'bob@example.com',
                password: '123456'
            })
            .expect(400);
    });

    it('Should not log in a user with the wrong password', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                email: userOne.email,
                password: 'thisisnotmypass'
            })
            .expect(400);
    });

    it('Should not log in a user with the wrong email', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                email: 'test2@example.com',
                password: userOne.password
            })
            .expect(400);
    });
});

describe('/POST logout', () => {
    it('Should return status 401 if a non-logged-in user tries to logout', async () => {
        await request(app)
            .post('/auth/logout')
            .expect(401);
    });
    it('Should return status 200 if a logged-in user logs out', async () => {
        const response = await request(app)
            .post('/auth/logout')
            .set('Cookie', `token=${userOneToken}`)
            .expect(200);
    });
});

describe('/POST validtoken', () => {
    it('Should decode a valid token and return the username and id', async () => {
        const response = await request(app)
            .post('/auth/validtoken')
            .set('Cookie', `token=${userOneToken}`);
        expect(response.body).toMatchObject({
            id: userOneId.toString(),
            username: userOne.username
        });
    });
    it('Should not decode an invalid token and return nothing', async () => {
        const response = await request(app)
            .post('/auth/validtoken')
            .set('Cookie', 'token=invalidtoken');
        expect(response.body).toMatchObject({});
    });
});