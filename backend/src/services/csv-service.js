const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const SchoolRepository = require('../repositories/school-repository');
const { csvRowSchema } = require('../schemas/csv-schema');

class CsvService {
  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async processCsvFile(filePath) {
    const schools = [];
    const errors = [];
    let rowNumber = 0;
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          rowNumber++;
          try {
            // Validar linha usando schema Zod
            const validatedRow = csvRowSchema.parse(row);
            const school = this.transformValidatedRowToSchool(validatedRow);
            schools.push(school);
          } catch (error) {
            if (error.errors) {
              const fieldErrors = error.errors.map(err => 
                `${err.path.join('.')}: ${err.message}`
              ).join(', ');
              errors.push(`Linha ${rowNumber}: ${fieldErrors}`);
            } else {
              errors.push(`Linha ${rowNumber}: ${error.message}`);
            }
          }
        })
        .on('end', async () => {
          try {
            if (errors.length > 0) {
              const errorMessage = `Arquivo CSV com formato incompatível`;
              reject(new Error(errorMessage));
              return;
            }

            if (schools.length === 0) {
              reject(new Error('Nenhum registro válido encontrado no arquivo CSV. Verifique se o arquivo contém os campos obrigatórios: NOMESC, DE, MUN, CODESC, TOT_SALAS_AULA, REFEITORIO'));
              return;
            }

            console.log(`Processando ${schools.length} escolas...`);
            
            const result = await this.processEfficiently(schools);
            
            resolve({
              message: `Arquivo processado com sucesso. ${result.inserted} escolas inseridas, ${result.updated} escolas atualizadas.`,
              count: schools.length,
              inserted: result.inserted,
              updated: result.updated
            });
          } catch (error) {
            console.error('Erro ao processar escolas:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Erro ao ler CSV:', error);
          reject(new Error('Erro ao ler arquivo CSV. Verifique se o arquivo está no formato correto (separador: ;)'));
        });
    });
  }

  async getSchoolsCount() {
    return await this.schoolRepository.count();
  }

  transformValidatedRowToSchool(validatedRow) {
    return {
      school_name: validatedRow.NOMESC,
      teaching_directorate: validatedRow.DE,
      municipality: validatedRow.MUN,
      school_code: validatedRow.CODESC,
      total_classrooms: validatedRow.TOT_SALAS_AULA,
      cafeteria: validatedRow.REFEITORIO,
    };
  }

  async processEfficiently(schools) {
    const allExistingSchools = await this.schoolRepository.list();
    const existingSchoolsMap = new Map();
    
    allExistingSchools.forEach(school => {
      existingSchoolsMap.set(school.school_code, school);
    });
    
    const schoolsToInsert = [];
    const schoolsToUpdate = [];
    
    for (const school of schools) {
      const existing = existingSchoolsMap.get(school.school_code);
      if (existing) {
        schoolsToUpdate.push({ id: existing.id, ...school });
      } else {
        schoolsToInsert.push(school);
      }
    }
    
    console.log(`Inserindo ${schoolsToInsert.length} escolas, atualizando ${schoolsToUpdate.length} escolas`);
    
    let inserted = 0;
    let updated = 0;
    
    if (schoolsToInsert.length > 0) {
      await this.schoolRepository.saveMany(schoolsToInsert);
      inserted = schoolsToInsert.length;
    }
    
    if (schoolsToUpdate.length > 0) {
      await this.schoolRepository.updateMany(schoolsToUpdate);
      updated = schoolsToUpdate.length;
    }
    
    return { inserted, updated };
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