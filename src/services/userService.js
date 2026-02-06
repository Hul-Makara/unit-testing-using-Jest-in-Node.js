const User = require('../models/user.model');

class UserService {
    async createUser(userData) {
        // validate required fields
        if (!userData.name || !userData.email) {
            throw new Error('Name and email are required');
        }
        // check if email already exists
        const existingUser = User.findAll().find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        return User.create(userData);
    }
    async getAllUsers() {
        return User.findAll();
    }
    async getUserById(id) {
        const user = User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async updateUser(id, userData) {
        const user = User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        // check if email is begin updated
        if (userData.email && userData.email !== user.email) {
            const existingUser = User.findAll().find(u => u.email === userData.email);
            if (existingUser) {
                throw new Error('Email already exists');
            }
        }
        return User.update(id, userData);
    }
    async deleteUser(id) {
        const user = User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return User.delete(id);
    }
}

module.exports = new UserService();

