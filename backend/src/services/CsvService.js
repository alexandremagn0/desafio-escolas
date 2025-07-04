const csv = require('csv-parser');
const fs = require('fs');
const csvRepository = require('../repositories/CsvRepository');

class CsvService {
  async processarCsv(caminhoArquivo) {
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(caminhoArquivo)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            const totalInseridos = await csvRepository.inserirEmLote(results);
            resolve({ total: totalInseridos });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async validarArquivo(arquivo) {
    if (!arquivo) {
      throw new Error('Arquivo CSV é obrigatório.');
    }

    const extensao = arquivo.originalname.split('.').pop().toLowerCase();
    if (extensao !== 'csv') {
      throw new Error('Arquivo deve ser do tipo CSV.');
    }

    return true;
  }

  async limparArquivoTemporario(caminhoArquivo) {
    try {
      if (fs.existsSync(caminhoArquivo)) {
        fs.unlinkSync(caminhoArquivo);
      }
    } catch (error) {
      console.error('Erro ao remover arquivo temporário:', error);
    }
  }
}

module.exports = new CsvService(); 