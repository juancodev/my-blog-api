import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeOfLengthInContentField1780683437937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "content" TYPE varchar(900) USING "content"::varchar(900)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "content" TYPE varchar(255)`);
  }
}
