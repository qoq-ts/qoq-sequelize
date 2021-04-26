import { column, migration } from '../../../src';

export default migration({
  async up(queryInferface) {
    await queryInferface.createTable('card', {
      id: column.int.primaryKey().autoIncrement(),
      user_id: column.int.notNull(),
      card_no: column.varChar.notNull().comment('bank card'),
      created_at: column.dateTime.notNull().defaultCurrent(),
    });
  },
  async down(queryInferface) {
    await queryInferface.dropTable('card');
  }
});
