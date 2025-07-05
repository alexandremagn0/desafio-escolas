const express = require('express');
const { listarEscolas, buscarEscola, criarEscola, atualizarEscola, deletarEscola } = require('../controllers/escolasController');
const validateSchema = require('../middleware/validateSchema');
const escolaSchema = require('../schemas/escolaSchema');
const escolaUpdateSchema = require('../schemas/escolaUpdateSchema');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Escola:
 *       type: object
 *       required:
 *         - nome_escola
 *         - diretoria_ensino
 *         - municipio
 *         - codigo_escola
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da escola
 *         nome_escola:
 *           type: string
 *           description: Nome da escola
 *         diretoria_ensino:
 *           type: string
 *           description: Diretoria de ensino responsável
 *         municipio:
 *           type: string
 *           description: Município onde a escola está localizada
 *         codigo_escola:
 *           type: string
 *           description: Código único da escola
 *         total_salas_aula:
 *           type: integer
 *           description: Número total de salas de aula
 *         refeitorio:
 *           type: boolean
 *           description: Se a escola possui refeitório
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *       example:
 *         nome_escola: "Escola Municipal João da Silva"
 *         diretoria_ensino: "Diretoria Regional de Ensino Centro"
 *         municipio: "São Paulo"
 *         codigo_escola: "123456"
 *         total_salas_aula: 15
 *         refeitorio: true
 */

/**
 * @swagger
 * /api/escolas:
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
router.get('/', listarEscolas);

/**
 * @swagger
 * /api/escolas/{id}:
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
router.get('/:id', buscarEscola);

/**
 * @swagger
 * /api/escolas:
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
 *               - nome_escola
 *               - diretoria_ensino
 *               - municipio
 *               - codigo_escola
 *             properties:
 *               nome_escola:
 *                 type: string
 *                 description: Nome da escola
 *               diretoria_ensino:
 *                 type: string
 *                 description: Diretoria de ensino responsável
 *               municipio:
 *                 type: string
 *                 description: Município onde a escola está localizada
 *               codigo_escola:
 *                 type: string
 *                 description: Código único da escola
 *               total_salas_aula:
 *                 type: integer
 *                 description: Número total de salas de aula
 *               refeitorio:
 *                 type: boolean
 *                 description: Se a escola possui refeitório
 *           example:
 *             nome_escola: "Escola Municipal João da Silva"
 *             diretoria_ensino: "Diretoria Regional de Ensino Centro"
 *             municipio: "São Paulo"
 *             codigo_escola: "123456"
 *             total_salas_aula: 15
 *             refeitorio: true
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
router.post('/', validateSchema(escolaSchema), criarEscola);

/**
 * @swagger
 * /api/escolas/{id}:
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
 *               nome_escola:
 *                 type: string
 *                 description: Nome da escola
 *               diretoria_ensino:
 *                 type: string
 *                 description: Diretoria de ensino responsável
 *               municipio:
 *                 type: string
 *                 description: Município onde a escola está localizada
 *               codigo_escola:
 *                 type: string
 *                 description: Código único da escola
 *               total_salas_aula:
 *                 type: integer
 *                 description: Número total de salas de aula
 *               refeitorio:
 *                 type: boolean
 *                 description: Se a escola possui refeitório
 *           example:
 *             nome_escola: "Escola Municipal João da Silva Atualizada"
 *             total_salas_aula: 20
 *             refeitorio: false
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
router.put('/:id', validateSchema(escolaUpdateSchema), atualizarEscola);

/**
 * @swagger
 * /api/escolas/{id}:
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
router.delete('/:id', deletarEscola);

module.exports = router;