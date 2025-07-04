const express = require('express');
const multer = require('multer');
const { uploadCsv } = require('../controllers/csvController');
const router = express.Router();

const upload = multer({ dest: 'src/uploads/' });

/**
 * @swagger
 * components:
 *   schemas:
 *     CsvUploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de sucesso
 *         total:
 *           type: integer
 *           description: Total de registros importados
 *       example:
 *         message: "CSV importado com sucesso!"
 *         total: 150
 *     
 *     CsvErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Descrição do erro
 *         details:
 *           type: string
 *           description: Detalhes adicionais do erro
 *       example:
 *         error: "Arquivo deve ser do tipo CSV."
 *         details: "Formato de arquivo não suportado"
 */

/**
 * @swagger
 * /api/csv/upload:
 *   post:
 *     summary: Faz upload de arquivo CSV
 *     description: Importa dados de escolas a partir de um arquivo CSV
 *     tags: [CSV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV com dados das escolas
 *     responses:
 *       200:
 *         description: CSV importado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CsvUploadResponse'
 *       400:
 *         description: Arquivo inválido ou formato incorreto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CsvErrorResponse'
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CsvErrorResponse'
 */
router.post('/upload', upload.single('file'), uploadCsv);

module.exports = router;
