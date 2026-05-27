import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatingAndUpdatingFields1779910111617 implements MigrationInterface {
  name = 'CreatingAndUpdatingFields1779910111617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" ADD "description" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "cover_image" character varying(888)`);
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "cover_image" TYPE character varying(800)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "cover_image" TYPE character varying(255)`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cover_image"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
  }
}
