import { column, migration } from '../../../src';

export default migration({
  async up(queryInterface) {
    await queryInterface.createTable('user', {
      id: column.int.primaryKey().autoIncrement(),
      name: column.varChar.notNull().comment('User Name'),
      age: column.tinyInt.notNull().comment('Less than 127'),
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user');
  },
});
