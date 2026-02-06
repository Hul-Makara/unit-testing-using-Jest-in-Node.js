const UserService = require('../services/userService');
const User = require('../models/user.model');

describe('User Service', () => {
    beforeEach(() => {
        User.clear();
    });

    describe('createUser', () => {
        it('should create and return a new user', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const user = await UserService.createUser(userData);

            expect(user).toHaveProperty('id');
            expect(user.name).toBe(userData.name);
            expect(user.email).toBe(userData.email);
            expect(user.age).toBe(userData.age);
        });

        it('should throw error when name is missing', async () => {
            const userData = {
                email: 'john@example.com',
                age: 30
            };

            await expect(UserService.createUser(userData))
                .rejects
                .toThrow('Name and email are required');
        });

        it('should throw error when email already exists', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            await UserService.createUser(userData);

            await expect(UserService.createUser(userData))
                .rejects
                .toThrow('Email already exists');
        });
    });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const createdUser = await UserService.createUser(userData);
            const user = await UserService.getUserById(createdUser.id);

            expect(user.id).toBe(createdUser.id);
            expect(user.name).toBe(userData.name);
        });

        it('should throw error when user not found', async () => {
            await expect(UserService.getUserById(999))
                .rejects
                .toThrow('User not found');
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const createdUser = await UserService.createUser(userData);

            const updateData = {
                name: 'John Updated',
                age: 31
            };

            const updatedUser = await UserService.updateUser(createdUser.id, updateData);

            expect(updatedUser.name).toBe(updateData.name);
            expect(updatedUser.age).toBe(updateData.age);
            expect(updatedUser.email).toBe(userData.email); // Email unchanged
        });

        it('should throw error when updating non-existent user', async () => {
            const updateData = { name: 'Updated' };

            await expect(UserService.updateUser(999, updateData))
                .rejects
                .toThrow('User not found');
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const createdUser = await UserService.createUser(userData);
            const deletedUser = await UserService.deleteUser(createdUser.id);

            expect(deletedUser.id).toBe(createdUser.id);

            // Verify user is deleted
            await expect(UserService.getUserById(createdUser.id))
                .rejects
                .toThrow('User not found');
        });

        it('should throw error when deleting non-existent user', async () => {
            await expect(UserService.deleteUser(999))
                .rejects
                .toThrow('User not found');
        });
    });
});