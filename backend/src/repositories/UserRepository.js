const AppDataSource = require('../config/database');

class UserRepository {
  async buscarPorEmail(email) {
    const repo = AppDataSource.getRepository('User');
    return await repo.findOne({ where: { email } });
  }

  async buscarPorId(id) {
    const repo = AppDataSource.getRepository('User');
    return await repo.findOne({ where: { id } });
  }

  async criar(user) {
    const repo = AppDataSource.getRepository('User');
    const newUser = repo.create(user);
    return await repo.save(newUser);
  }

  async atualizar(id, user) {
    const repo = AppDataSource.getRepository('User');
    await repo.update(id, user);
    return await repo.findOne({ where: { id } });
  }
}

module.exports = new UserRepository(); 