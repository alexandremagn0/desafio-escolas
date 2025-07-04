const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class CreateInitialTables1700000000000 {
    name = 'CreateInitialTables1700000000000'

    async up(queryRunner) {
        // Criar tabela de usuários
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" SERIAL NOT NULL,
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "nome" character varying(100) NOT NULL,
                "sobrenome" character varying(100) NOT NULL,
                "data_nascimento" date NOT NULL,
                "documento" character varying(50) NOT NULL,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_9e6b2b8b8b8b8b8b8b8b8b8b8b" UNIQUE ("documento"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Criar tabela de instalações escolares
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "instalacoes_escolares" (
                "id" SERIAL NOT NULL,
                "nome_escola" text,
                "diretoria_ensino" text,
                "municipio" text,
                "codigo_escola" text,
                "total_salas_aula" integer,
                "refeitorio" boolean,
                "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_instalacoes_escolares" PRIMARY KEY ("id")
            )
        `);
    }

    async down(queryRunner) {
        // Rollback: remover as tabelas na ordem inversa
        await queryRunner.query(`DROP TABLE "instalacoes_escolares"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
} 