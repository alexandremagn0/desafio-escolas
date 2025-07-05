const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth-middleware');

const authRoutes = require('./auth-routes');
const schoolRoutes = require('./schools-routes');
const csvRoutes = require('./csv-routes');

router.use('/auth', authRoutes);
router.use('/schools', authMiddleware, schoolRoutes);
router.use('/csv', authMiddleware, csvRoutes);

module.exports = router;
