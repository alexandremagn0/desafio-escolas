const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../config/db');

const uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo CSV é obrigatório.' });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Processar em lotes de 100 registros
        const batchSize = 100;
        for (let i = 0; i < results.length; i += batchSize) {
          const batch = results.slice(i, i + batchSize);
          
          // Criar query com múltiplos valores
          const values = batch.map((row, index) => {
            const offset = index * 6;
            return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
          }).join(', ');
          
          const params = batch.flatMap(row => [
            row['NOMESC'],
            row['DE'],
            row['MUN'],
            row['CODESC'],
            parseInt(row['TOT_SALAS_AULA']) || 0,
            row['REFEITORIO'] === '1'
          ]);
          
          await client.query(
            `INSERT INTO instalacoes_escolares
             (nome_escola, diretoria_ensino, municipio, codigo_escola, total_salas_aula, refeitorio)
             VALUES ${values}`,
            params
          );
        }
        
        await client.query('COMMIT');
        
        // Remover arquivo temporário
        fs.unlinkSync(req.file.path);
        
        res.json({ 
          message: 'CSV importado com sucesso!', 
          total: results.length 
        });
        
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao importar CSV:', error);
        
        // Remover arquivo temporário em caso de erro
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Erro ao remover arquivo temporário:', unlinkError);
        }
        
        res.status(500).json({ 
          error: 'Erro ao importar dados.',
          details: error.message 
        });
      } finally {
        client.release();
      }
    })
    .on('error', (error) => {
      console.error('Erro ao ler CSV:', error);
      
      // Remover arquivo temporário em caso de erro
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Erro ao remover arquivo temporário:', unlinkError);
      }
      
      res.status(500).json({ 
        error: 'Erro ao processar arquivo CSV.',
        details: error.message 
      });
    });
};

module.exports = { uploadCsv };
