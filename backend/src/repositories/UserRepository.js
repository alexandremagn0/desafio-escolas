const AppDataSource = require('../config/database');

class UserRepository {
  async findByEmail(email) {
    const repo = AppDataSource.getRepository('User');
    return await repo.findOne({ where: { email } });
  }

  async findById(id) {
    const repo = AppDataSource.getRepository('User');
    return await repo.findOne({ where: { id } });
  }

  async create(user) {
    const repo = AppDataSource.getRepository('User');
    const newUser = repo.create(user);
    return await repo.save(newUser);
  }

  async update(id, user) {
    const repo = AppDataSource.getRepository('User');
    await repo.update(id, user);
    return await repo.findOne({ where: { id } });
  }
}

module.exports = new UserRepository(); 