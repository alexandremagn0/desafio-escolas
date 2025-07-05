class EscolaService {
  constructor(escolaRepository) {
    this.escolaRepository = escolaRepository;
  }
  async listarEscolas() {
    return await this.escolaRepository.listar();
  }

  async buscarEscola(id) {
    const escola = await this.escolaRepository.buscarPorId(id);
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    return escola;
  }

  async criarEscola(dados) {
    return await this.escolaRepository.criar(dados);
  }

  async atualizarEscola(id, dados) {
    const escola = await this.escolaRepository.atualizar(id, dados);
    if (!escola) {
      throw new Error('Escola não encontrada para atualizar');
    }
    return escola;
  }

  async deletarEscola(id) {
    const escola = await this.escolaRepository.deletar(id);
    if (!escola) {
      throw new Error('Escola não encontrada para deletar');
    }
    return escola;
  }
}

module.exports = EscolaService; 