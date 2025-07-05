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
    first_name: {
      type: 'varchar',
      length: 100,
    },
    last_name: {
      type: 'varchar',
      length: 100,
    },
    birth_date: {
      type: 'date',
    },
    document: {
      type: 'varchar',
      length: 50,
      unique: true,
    },
  },
}); 