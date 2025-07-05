const express = require('express');
const AuthController = require('../controllers/auth-controller');
const router = express.Router();

const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *       example:
 *         email: "usuario@exemplo.com"
 *         password: "senha123"
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID do usuário
 *             email:
 *               type: string
 *               description: Email do usuário
 *             nome:
 *               type: string
 *               description: Nome do usuário
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: 1
 *           email: "usuario@exemplo.com"
 *           nome: "João Silva"
 *     
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de confirmação do logout
 *       example:
 *         message: "Logout realizado com sucesso"
 *   
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 *       400:
 *         description: Dados inválidos
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 */
router.post('/register', authController.register.bind(authController));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Realiza logout do usuário
 *     description: Invalida a sessão do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 */
router.post('/logout', authController.logout.bind(authController));

module.exports = router;
