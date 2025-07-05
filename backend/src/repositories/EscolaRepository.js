const { AppDataSource } = require('../config/database');
const IEscolaRepository = require('../interfaces/IEscolaRepository');

class EscolaRepository extends IEscolaRepository {
  async list() {
    const repo = AppDataSource.getRepository('SchoolInstallation');
    return await repo.find({ order: { id: 'ASC' } });
  }

  async findById(id) {
    const repo = AppDataSource.getRepository('SchoolInstallation');
    return await repo.findOne({ where: { id } });
  }

  async findBySchoolCode(schoolCode) {
    const repo = AppDataSource.getRepository('SchoolInstallation');
    return await repo.findOne({ where: { school_code: schoolCode } });
  }

  async create(schoolData) {
    const repo = AppDataSource.getRepository('SchoolInstallation');
    const school = repo.create(schoolData);
    return await repo.save(school);
  }

  async update(id, schoolData) {
    const repo = AppDataSource.getRepository('SchoolInstallation');
    await repo.update(id, schoolData);
    return await this.findById(id);
  }

  async delete(id) {
    const repo = AppDataSource.getRepository('SchoolInstallation');
    const school = await repo.findOne({ where: { id } });
    if (school) {
      await repo.remove(school);
    }
    return school;
  }
}

module.exports = EscolaRepository; 