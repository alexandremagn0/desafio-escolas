class EscolaService {
  constructor(escolaRepository) {
    this.escolaRepository = escolaRepository;
  }
  async listSchools() {
    return await this.escolaRepository.list();
  }

  async findSchool(id) {
    const school = await this.escolaRepository.findById(id);
    if (!school) {
      throw new Error('Escola não encontrada');
    }
    return school;
  }

  async createSchool(data) {
    return await this.escolaRepository.create(data);
  }

  async updateSchool(id, data) {
    const school = await this.escolaRepository.update(id, data);
    if (!school) {
      throw new Error('Escola não encontrada para atualizar');
    }
    return school;
  }

  async deleteSchool(id) {
    const school = await this.escolaRepository.delete(id);
    if (!school) {
      throw new Error('Escola não encontrada para deletar');
    }
    return school;
  }
}

module.exports = EscolaService; 