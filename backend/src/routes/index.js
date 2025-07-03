const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// Importação das rotas por domínio
const authRoutes = require('./authRoutes');
const escolasRoutes = require('./escolasRoutes');
const csvRoutes = require('./csvRoutes');

// Rotas públicas (não requerem autenticação)
router.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
router.use('/escolas', authMiddleware, escolasRoutes);  // CRUD de escolas
router.use('/csv', authMiddleware, csvRoutes);          // Upload de arquivos CSV

module.exports = router;
