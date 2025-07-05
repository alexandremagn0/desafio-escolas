class SchoolRepositoryInterface {
  async list() {
    throw new Error('Método list() deve ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() deve ser implementado');
  }

  async findBySchoolCode(schoolCode) {
    throw new Error('Método findBySchoolCode() deve ser implementado');
  }

  async create(schoolData) {
    throw new Error('Método create() deve ser implementado');
  }

  async update(id, schoolData) {
    throw new Error('Método update() deve ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() deve ser implementado');
  }
}

module.exports = SchoolRepositoryInterface; 