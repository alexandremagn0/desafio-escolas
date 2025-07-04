const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'InstalacaoEscolar',
  tableName: 'instalacoes_escolares',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nome_escola: {
      type: 'text',
    },
    diretoria_ensino: {
      type: 'text',
    },
    municipio: {
      type: 'text',
    },
    codigo_escola: {
      type: 'text',
    },
    total_salas_aula: {
      type: 'int',
      nullable: true,
    },
    refeitorio: {
      type: 'boolean',
      nullable: true,
    },
    criado_em: {
      type: 'timestamp',
      createDate: true,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
}); 