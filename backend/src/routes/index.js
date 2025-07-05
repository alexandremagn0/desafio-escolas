const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const authRoutes = require('./authRoutes');
const escolasRoutes = require('./escolasRoutes');
const csvRoutes = require('./csvRoutes');

router.use('/auth', authRoutes);

router.use('/escolas', authMiddleware, escolasRoutes);
router.use('/csv', authMiddleware, csvRoutes);

module.exports = router;
