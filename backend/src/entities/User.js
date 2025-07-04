const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    email: {
      type: 'varchar',
      unique: true,
      length: 255,
    },
    password: {
      type: 'varchar',
      length: 255,
    },
    nome: {
      type: 'varchar',
      length: 100,
    },
    sobrenome: {
      type: 'varchar',
      length: 100,
    },
    data_nascimento: {
      type: 'date',
    },
    documento: {
      type: 'varchar',
      length: 50,
      unique: true,
    },
  },
}); 