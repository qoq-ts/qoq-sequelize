import { column, migration } from '../../../src';

export default migration({
  async up(queryInterface) {
    await queryInterface.createTable('user', {
      id: column.int.primaryKey().autoIncrement(),
      name: column.varChar.notNull().comment('User Name'),
      age: column.tinyInt.unsigned().notNull().comment('Less than 256'),
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user');
  },
});
