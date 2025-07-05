const csv = require('csv-parser');
const fs = require('fs');
const csvRepository = require('../repositories/CsvRepository');

class CsvService {
  async processCsv(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            const totalInserted = await csvRepository.insertBatch(results);
            resolve({ total: totalInserted });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async validateFile(file) {
    if (!file) {
      throw new Error('Arquivo CSV é obrigatório.');
    }

    const extension = file.originalname.split('.').pop().toLowerCase();
    if (extension !== 'csv') {
      throw new Error('Arquivo deve ser do tipo CSV.');
    }

    return true;
  }

  async cleanTemporaryFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Erro ao remover arquivo temporário:', error);
    }
  }
}

module.exports = new CsvService(); 