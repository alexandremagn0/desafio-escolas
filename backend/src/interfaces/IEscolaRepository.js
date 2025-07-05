class IEscolaRepository {
  async list() {
    throw new Error('Método list deve ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById deve ser implementado');
  }

  async create(school) {
    throw new Error('Método create deve ser implementado');
  }

  async update(id, school) {
    throw new Error('Método update deve ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete deve ser implementado');
  }
}

module.exports = IEscolaRepository; 