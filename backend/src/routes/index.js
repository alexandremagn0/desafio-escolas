const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// Importação das rotas por domínio
const authRoutes = require('./authRoutes');
const escolasRoutes = require('./escolasRoutes');
const csvRoutes = require('./csvRoutes');

// Rotas públicas (não requerem autenticação)
router.use('/auth', authRoutes);

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas protegidas (requerem autenticação)
router.use('/escolas', escolasRoutes);  // CRUD de escolas
router.use('/csv', csvRoutes);          // Upload de arquivos CSV

module.exports = router;
