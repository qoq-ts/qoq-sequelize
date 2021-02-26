import { column, migration } from '../../../src';

const TABLE_NAME = 'project';

export default migration({
  async up(queryInterface) {
    await queryInterface.createTable(TABLE_NAME, {
      id: column.int.primaryKey().autoIncrement(),
      user_id: column.int.notNull(),
      title: column.varChar.notNull(),
      description: column.text.comment('Not important'),
    });

    await queryInterface.addIndex(TABLE_NAME, ['user_id'], {
      name: 'i-user_id',
      unique: false,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable(TABLE_NAME);
  },
});
