const AppDataSource = require('../config/database');
const IEscolaRepository = require('../interfaces/IEscolaRepository');

class EscolaRepository extends IEscolaRepository {
  async listar() {
    const repo = AppDataSource.getRepository('InstalacaoEscolar');
    return await repo.find({ order: { id: 'ASC' } });
  }

  async buscarPorId(id) {
    const repo = AppDataSource.getRepository('InstalacaoEscolar');
    return await repo.findOne({ where: { id } });
  }

  async criar(escola) {
    const repo = AppDataSource.getRepository('InstalacaoEscolar');
    const newEscola = repo.create(escola);
    return await repo.save(newEscola);
  }

  async atualizar(id, escola) {
    const repo = AppDataSource.getRepository('InstalacaoEscolar');
    await repo.update(id, escola);
    return await repo.findOne({ where: { id } });
  }

  async deletar(id) {
    const repo = AppDataSource.getRepository('InstalacaoEscolar');
    const escola = await repo.findOne({ where: { id } });
    if (escola) {
      await repo.remove(escola);
    }
    return escola;
  }
}

module.exports = EscolaRepository; 