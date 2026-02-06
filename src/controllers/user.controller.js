const userService = require('../services/userService');

class UserController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getUsers(req, res) {
        try {
            const user = await userService.getAllUsers();
            res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: user,
                count: user.length
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: user
            });
        } catch (error) {
            const status = error.message === 'User not found' ? 404 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }
    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user
            });
        } catch (error) {
            const status = error.message === 'User not found' ? 404 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }
    async deleteUser(req, res) {
        try {
            const user = await userService.deleteUser(req.params.id);
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                data: user
            });
        } catch (error) {
            const status = error.message === 'User not found' ? 404 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
