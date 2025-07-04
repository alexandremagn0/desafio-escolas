// escolasRoutes.js
const express = require('express');
const { listarEscolas, buscarEscola, criarEscola, atualizarEscola, deletarEscola } = require('../controllers/escolasController');
const validateSchema = require('../middleware/validateSchema');
const escolaSchema = require('../schemas/escolaSchema');
const escolaUpdateSchema = require('../schemas/escolaUpdateSchema');
const router = express.Router();

router.get('/', listarEscolas);
router.get('/:id', buscarEscola);
router.post('/', validateSchema(escolaSchema), criarEscola);
router.put('/:id', validateSchema(escolaUpdateSchema), atualizarEscola);
router.delete('/:id', deletarEscola);

module.exports = router;