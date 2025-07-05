const AppDataSource = require('../config/database');

class CsvRepository {
  async inserirEmLote(dados) {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      const repo = queryRunner.manager.getRepository('InstalacaoEscolar');
      const batchSize = 100;
      for (let i = 0; i < dados.length; i += batchSize) {
        const batch = dados.slice(i, i + batchSize);
        
        const escolas = batch.map(row => ({
          nome_escola: row['NOMESC'],
          diretoria_ensino: row['DE'],
          municipio: row['MUN'],
          codigo_escola: row['CODESC'],
          total_salas_aula: parseInt(row['TOT_SALAS_AULA']) || 0,
          refeitorio: row['REFEITORIO'] === '1'
        }));
        
        await repo.save(escolas);
      }
      
      await queryRunner.commitTransaction();
      return dados.length;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

module.exports = new CsvRepository(); 