// escolasRoutes.js
const express = require('express');
const { listarEscolas, buscarEscola, criarEscola, atualizarEscola, deletarEscola } = require('../controllers/escolasController');
const router = express.Router();

router.get('/', listarEscolas);
router.get('/:id', buscarEscola);
router.post('/', criarEscola);
router.put('/:id', atualizarEscola);
router.delete('/:id', deletarEscola);

module.exports = router;