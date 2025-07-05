const { getRepository } = require('../config/database');

class UserRepository {
  async findByEmail(email) {
    const repo = getRepository('User');
    return await repo.findOne({ where: { email } });
  }

  async findById(id) {
    const repo = getRepository('User');
    return await repo.findOne({ where: { id } });
  }

  async create(user) {
    const repo = getRepository('User');
    const newUser = repo.create(user);
    return await repo.save(newUser);
  }

  async update(id, user) {
    const repo = getRepository('User');
    await repo.update(id, user);
    return await repo.findOne({ where: { id } });
  }
}

module.exports = UserRepository; 