class IEscolaRepository {
  async listar() {
    throw new Error('Método listar deve ser implementado');
  }

  async buscarPorId(id) {
    throw new Error('Método buscarPorId deve ser implementado');
  }

  async criar(escola) {
    throw new Error('Método criar deve ser implementado');
  }

  async atualizar(id, escola) {
    throw new Error('Método atualizar deve ser implementado');
  }

  async deletar(id) {
    throw new Error('Método deletar deve ser implementado');
  }
}

module.exports = IEscolaRepository; 