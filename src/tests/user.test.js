const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');

describe('User Management API', () => {
    // Clear users before each test
    beforeEach(() => {
        User.clear();
    });

    describe('POST /api/users - Create User', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.name).toBe(userData.name);
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.age).toBe(userData.age);
            expect(response.body.message).toBe('User created successfully');
        });

        it('should return 400 when required fields are missing', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ age: 30 })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });

        it('should return 400 when email already exists', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            // Create first user
            await request(app).post('/api/users').send(userData);

            // Try to create user with same email
            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Email already exists');
        });
    });

    describe('GET /api/users - Get All Users', () => {
        it('should return empty array when no users exist', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
            expect(response.body.count).toBe(0);
        });

        it('should return all users', async () => {
            // Create test users
            const users = [
                { name: 'John Doe', email: 'john@example.com', age: 30 },
                { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
            ];

            for (const user of users) {
                await request(app).post('/api/users').send(user);
            }

            const response = await request(app)
                .get('/api/users')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.count).toBe(2);
        });
    });

    describe('GET /api/users/:id - Get User by ID', () => {
        it('should return user when found', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const createResponse = await request(app)
                .post('/api/users')
                .send(userData);

            const userId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/api/users/${userId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(userId);
            expect(response.body.data.name).toBe(userData.name);
        });

        it('should return 404 when user not found', async () => {
            const response = await request(app)
                .get('/api/users/999')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found');
        });

        it('should return 400 when ID is invalid', async () => {
            const response = await request(app)
                .get('/api/users/abc')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('PUT /api/users/:id - Update User', () => {
        it('should update user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const createResponse = await request(app)
                .post('/api/users')
                .send(userData);

            const userId = createResponse.body.data.id;

            const updateData = {
                name: 'John Updated',
                email: 'john.updated@example.com',
                age: 31
            };

            const response = await request(app)
                .put(`/api/users/${userId}`)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(updateData.name);
            expect(response.body.data.email).toBe(updateData.email);
            expect(response.body.data.age).toBe(updateData.age);
            expect(response.body.message).toBe('User updated successfully');
        });

        it('should return 404 when updating non-existent user', async () => {
            const updateData = {
                name: 'John Updated',
                email: 'john.updated@example.com',
                age: 31
            };

            const response = await request(app)
                .put('/api/users/999')
                .send(updateData)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found');
        });
    });

    describe('DELETE /api/users/:id - Delete User', () => {
        it('should delete user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const createResponse = await request(app)
                .post('/api/users')
                .send(userData);

            const userId = createResponse.body.data.id;

            const response = await request(app)
                .delete(`/api/users/${userId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(userId);
            expect(response.body.message).toBe('User deleted successfully');

            // Verify user is deleted
            const getResponse = await request(app)
                .get(`/api/users/${userId}`)
                .expect(404);

            expect(getResponse.body.message).toBe('User not found');
        });

        it('should return 404 when deleting non-existent user', async () => {
            const response = await request(app)
                .delete('/api/users/999')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found');
        });
    });

    describe('Health Check', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.timestamp).toBeDefined();
        });
    });
});