const express = require('express');
const { listSchools, getSchoolById, createSchool, updateSchool, deleteSchool } = require('../controllers/school-controller');
const validateSchema = require('../middleware/validate-schema');
const schoolSchema = require('../schemas/school-schema');
const schoolUpdateSchema = require('../schemas/school-update-schema');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Escola:
 *       type: object
 *       required:
 *         - school_name
 *         - teaching_directorate
 *         - municipality
 *         - school_code
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da escola
 *         school_name:
 *           type: string
 *           description: Nome da escola
 *         teaching_directorate:
 *           type: string
 *           description: Diretoria de ensino responsável
 *         municipality:
 *           type: string
 *           description: Município onde a escola está localizada
 *         school_code:
 *           type: string
 *           description: Código único da escola
 *         total_classrooms:
 *           type: integer
 *           description: Número total de salas de aula
 *         cafeteria:
 *           type: boolean
 *           description: Se a escola possui refeitório
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *       example:
 *         school_name: "Escola Municipal João da Silva"
 *         teaching_directorate: "Diretoria Regional de Ensino Centro"
 *         municipality: "São Paulo"
 *         school_code: "123456"
 *         total_classrooms: 15
 *         cafeteria: true
 */

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Lista todas as escolas
 *     description: Retorna uma lista de todas as escolas cadastradas no sistema
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de escolas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Escola'
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', listSchools);

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Busca uma escola específica
 *     description: Retorna os dados de uma escola pelo seu ID
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da escola
 *     responses:
 *       200:
 *         description: Escola encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escola'
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 *       404:
 *         description: Escola não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', getSchoolById);

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Cria uma nova escola
 *     description: Cadastra uma nova escola no sistema
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school_name
 *               - teaching_directorate
 *               - municipality
 *               - school_code
 *             properties:
 *               school_name:
 *                 type: string
 *                 description: Nome da escola
 *               teaching_directorate:
 *                 type: string
 *                 description: Diretoria de ensino responsável
 *               municipality:
 *                 type: string
 *                 description: Município onde a escola está localizada
 *               school_code:
 *                 type: string
 *                 description: Código único da escola
 *               total_classrooms:
 *                 type: integer
 *                 description: Número total de salas de aula
 *               cafeteria:
 *                 type: boolean
 *                 description: Se a escola possui refeitório
 *           example:
 *             school_name: "Escola Municipal João da Silva"
 *             teaching_directorate: "Diretoria Regional de Ensino Centro"
 *             municipality: "São Paulo"
 *             school_code: "123456"
 *             total_classrooms: 15
 *             cafeteria: true
 *     responses:
 *       201:
 *         description: Escola criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escola'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', validateSchema(schoolSchema), createSchool);

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Atualiza uma escola
 *     description: Atualiza os dados de uma escola existente
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da escola
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school_name:
 *                 type: string
 *                 description: Nome da escola
 *               teaching_directorate:
 *                 type: string
 *                 description: Diretoria de ensino responsável
 *               municipality:
 *                 type: string
 *                 description: Município onde a escola está localizada
 *               school_code:
 *                 type: string
 *                 description: Código único da escola
 *               total_classrooms:
 *                 type: integer
 *                 description: Número total de salas de aula
 *               cafeteria:
 *                 type: boolean
 *                 description: Se a escola possui refeitório
 *           example:
 *             school_name: "Escola Municipal João da Silva Atualizada"
 *             total_classrooms: 20
 *             cafeteria: false
 *     responses:
 *       200:
 *         description: Escola atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escola'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 *       404:
 *         description: Escola não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', validateSchema(schoolUpdateSchema), updateSchool);

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Remove uma escola
 *     description: Remove uma escola do sistema pelo seu ID
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da escola
 *     responses:
 *       200:
 *         description: Escola removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Escola removida com sucesso"
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 *       404:
 *         description: Escola não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', deleteSchool);

module.exports = router;