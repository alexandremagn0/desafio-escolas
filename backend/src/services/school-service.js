class SchoolService {
  constructor(schoolRepository) {
    this.schoolRepository = schoolRepository;
  }

  async list() {
    return await this.schoolRepository.list();
  }

  async findById(id) {
    const school = await this.schoolRepository.findById(id);
    if (!school) {
      throw new Error('Escola não encontrada');
    }
    return school;
  }

  async create(data) {
    return await this.schoolRepository.create(data);
  }

  async update(id, data) {
    const school = await this.schoolRepository.update(id, data);
    if (!school) {
      throw new Error('Escola não encontrada');
    }
    return school;
  }

  async delete(id) {
    const school = await this.schoolRepository.delete(id);
    if (!school) {
      throw new Error('Escola não encontrada');
    }
    return school;
  }
}

module.exports = SchoolService; 