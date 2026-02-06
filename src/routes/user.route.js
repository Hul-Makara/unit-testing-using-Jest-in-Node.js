const express = require('express');
const router = express.Router();
const { validateUser, validateId } = require('../middleware/validation');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');

// User routes
router.post('/users', validateUser, createUser);
router.get('/users', getUsers);
router.get('/users/:id', validateId, getUserById);
router.put('/users/:id', validateId, validateUser, updateUser);
router.delete('/users/:id', validateId, deleteUser);

module.exports = router;