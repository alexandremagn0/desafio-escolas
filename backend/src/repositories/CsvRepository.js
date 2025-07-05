const AppDataSource = require('../config/database');

class CsvRepository {
  async insertBatch(data) {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      const repo = queryRunner.manager.getRepository('SchoolInstallation');
      const batchSize = 100;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        const schools = batch.map(row => ({
          school_name: row['NOMESC'],
          teaching_directorate: row['DE'],
          municipality: row['MUN'],
          school_code: row['CODESC'],
          total_classrooms: parseInt(row['TOT_SALAS_AULA']) || 0,
          cafeteria: row['REFEITORIO'] === '1'
        }));
        
        await repo.save(schools);
      }
      
      await queryRunner.commitTransaction();
      return data.length;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

module.exports = new CsvRepository(); 