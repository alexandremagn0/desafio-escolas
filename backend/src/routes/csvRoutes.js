const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../config/db');

const router = express.Router();

// Configuração do multer (salvar no /uploads temporariamente)
const upload = multer({ dest: 'src/uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo CSV é obrigatório.' });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => {
      // Aqui você pode validar os dados, ajustar campos etc.
      results.push(data);
    })
    .on('end', async () => {
      try {
        // Inserir no banco (exemplo básico)
        for (const row of results) {
          // Ajuste os nomes dos campos conforme seu CSV
          await pool.query(
            `INSERT INTO instalacoes_escolares
                (nome_escola, diretoria_ensino, municipio, codigo_escola, total_salas_aula, refeitorio)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                row['NOMESC'],
                row['DE'],
                row['MUN'],
                row['CODESC'],
                parseInt(row['TOT_SALAS_AULA']) || 0,
                row['REFEITORIO'] === '1'  // converte para boolean
                ]
            );
        }
        // Remove arquivo após processamento
        fs.unlinkSync(req.file.path);

        res.json({ message: 'CSV importado com sucesso!', total: results.length });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao importar dados.' });
      }
    });
});

module.exports = router;
