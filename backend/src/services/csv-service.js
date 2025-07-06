const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const SchoolRepository = require('../repositories/school-repository');

class CsvService {
  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async processCsvFile(filePath) {
    const schools = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const school = this.transformCsvRowToSchool(row);
          schools.push(school);
        })
        .on('end', async () => {
          try {
            await this.schoolRepository.clear();
            const savedSchools = await this.schoolRepository.saveMany(schools);
            resolve({
              message: `Arquivo processado com sucesso. ${savedSchools.length} escolas importadas.`,
              count: savedSchools.length
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async getSchoolsCount() {
    return await this.schoolRepository.count();
  }

  transformCsvRowToSchool(row) {
    return {
      school_name: row.NOMESC,
      teaching_directorate: row.DE,
      municipality: row.MUN,
      school_code: row.CODESC,
      total_classrooms: parseInt(row.TOT_SALAS_AULA) || 0,
      cafeteria: row.REFEITORIO === '1',
      // created_at: new Date(),
      // updated_at: new Date()
    };
  }

  // Método para processar dados em lote (se necessário)
  async processBatchData(data) {
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const schools = batch.map(row => this.transformCsvRowToSchool(row));
      
      await this.schoolRepository.saveMany(schools);
      totalInserted += schools.length;
    }
    
    return totalInserted;
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

module.exports = CsvService; 