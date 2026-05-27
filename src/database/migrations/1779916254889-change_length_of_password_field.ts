import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLengthOfPasswordField1779916254889 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" TYPE varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" TYPE varchar(50)`);
  }
}
