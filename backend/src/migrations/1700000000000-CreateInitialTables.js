const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class CreateInitialTables1700000000000 {
    name = 'CreateInitialTables1700000000000'

    async up(queryRunner) {
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
                CONSTRAINT "UQ_9e6b2b8b8b8b8b8b8b8b8b8b" UNIQUE ("documento"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "school_installations" (
                "id" SERIAL NOT NULL,
                "school_name" text,
                "teaching_directorate" text,
                "municipality" text,
                "school_code" text,
                "total_classrooms" integer,
                "cafeteria" boolean,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_school_installations" PRIMARY KEY ("id")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "school_installations"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
} 