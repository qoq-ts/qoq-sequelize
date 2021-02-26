import { column, migration } from '../../../src';

export const Invalid = migration({
  async up(queryInterface) {
    await queryInterface.createTable('invalid_tb', {
      id: column.int.primaryKey().autoIncrement(),
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('invalid_tb');
  },
});
