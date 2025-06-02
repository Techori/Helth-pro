
const express = require('express');
const router = express.Router();
const userController = require('../controllers/hospital/userController');

// POST /api/users - Add a new user
router.post('/', userController.addUser);

module.exports = router;