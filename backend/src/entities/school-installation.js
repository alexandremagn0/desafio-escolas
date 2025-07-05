const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'SchoolInstallation',
  tableName: 'school_installations',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    school_name: {
      type: 'text',
    },
    teaching_directorate: {
      type: 'text',
    },
    municipality: {
      type: 'text',
    },
    school_code: {
      type: 'text',
    },
    total_classrooms: {
      type: 'int',
      nullable: true,
    },
    cafeteria: {
      type: 'boolean',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
}); 