const express = require('express');
const SchoolsController = require('../controllers/schools-controller');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();

const schoolsController = new SchoolsController();

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Lista todas as escolas
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de escolas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/School'
 *       401:
 *         description: Não autorizado
 */
router.get('/', authMiddleware, schoolsController.list.bind(schoolsController));

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Busca uma escola por ID
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Escola encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       404:
 *         description: Escola não encontrada
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', authMiddleware, schoolsController.getById.bind(schoolsController));

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Cria uma nova escola
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolCreate'
 *     responses:
 *       201:
 *         description: Escola criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', authMiddleware, schoolsController.create.bind(schoolsController));

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Atualiza uma escola
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolUpdate'
 *     responses:
 *       200:
 *         description: Escola atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       404:
 *         description: Escola não encontrada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', authMiddleware, schoolsController.update.bind(schoolsController));

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Remove uma escola
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Escola removida com sucesso
 *       404:
 *         description: Escola não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', authMiddleware, schoolsController.delete.bind(schoolsController));

module.exports = router; 