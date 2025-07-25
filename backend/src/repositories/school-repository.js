const { getRepository } = require('../config/database');
const SchoolRepositoryInterface = require('../interfaces/school-repository-interface');

class SchoolRepository extends SchoolRepositoryInterface {
  async list() {
    const repo = getRepository('SchoolInstallation');
    return await repo.find({ order: { id: 'ASC' } });
  }

  async findById(id) {
    const repo = getRepository('SchoolInstallation');
    return await repo.findOne({ where: { id } });
  }

  async findBySchoolCode(schoolCode) {
    const repo = getRepository('SchoolInstallation');
    return await repo.findOne({ where: { school_code: schoolCode } });
  }

  async create(schoolData) {
    const repo = getRepository('SchoolInstallation');
    const school = repo.create(schoolData);
    return await repo.save(school);
  }

  async update(id, schoolData) {
    const repo = getRepository('SchoolInstallation');
    await repo.update(id, schoolData);
    return await this.findById(id);
  }

  async updateMany(schools) {
    const repo = getRepository('SchoolInstallation');
    const updates = schools.map(school => {
      const { id, ...data } = school;
      return repo.update(id, data);
    });
    await Promise.all(updates);
  }

  async delete(id) {
    const repo = getRepository('SchoolInstallation');
    const school = await repo.findOne({ where: { id } });
    if (school) {
      await repo.remove(school);
      return { message: 'Escola removida com sucesso' };
    }
    throw new Error('Escola não encontrada');
  }

  async saveMany(schools) {
    const repo = getRepository('SchoolInstallation');
    return await repo.save(schools);
  }

  async clear() {
    const repo = getRepository('SchoolInstallation');
    await repo.clear();
  }

  async count() {
    const repo = getRepository('SchoolInstallation');
    return await repo.count();
  }
}

module.exports = SchoolRepository; 