// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const loginSchema = require('../schemas/loginSchema');

router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', authMiddleware, logout);

module.exports = router;
