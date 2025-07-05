const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const CsvRepository = require('../repositories/csv-repository');

class CsvService {
  constructor() {
    this.csvRepository = new CsvRepository();
  }

  async processCsvFile(filePath) {
    const schools = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const school = {
            school_code: row.codigo_escola,
            school_name: row.nome_escola,
            address: row.endereco,
            city: row.cidade,
            state: row.estado,
            zip_code: row.cep,
            phone: row.telefone,
            email: row.email,
            principal_name: row.nome_diretor,
            principal_phone: row.telefone_diretor,
            principal_email: row.email_diretor,
            school_type: row.tipo_escola,
            education_level: row.nivel_ensino,
            enrollment: parseInt(row.matriculas) || 0,
            teachers_count: parseInt(row.professores) || 0,
            classrooms_count: parseInt(row.salas_aula) || 0,
            computer_labs_count: parseInt(row.laboratorios_informatica) || 0,
            science_labs_count: parseInt(row.laboratorios_ciencias) || 0,
            library: row.biblioteca === 'Sim',
            sports_court: row.quadra_esportes === 'Sim',
            cafeteria: row.refeitorio === 'Sim',
            auditorium: row.auditorio === 'Sim',
            internet_access: row.acesso_internet === 'Sim',
            computer_student_ratio: parseFloat(row.ratio_computador_aluno) || 0,
            created_at: new Date(),
            updated_at: new Date()
          };
          schools.push(school);
        })
        .on('end', async () => {
          try {
            await this.csvRepository.clearSchools();
            const savedSchools = await this.csvRepository.saveSchools(schools);
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
    return await this.csvRepository.getSchoolsCount();
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