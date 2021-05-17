import { seed } from '../../../src';

export default seed({
  async up(queryInterface) {
    await queryInterface.bulkInsert('user', [
      {
        name: 'bob',
        age: 20,
      },
      {
        name: 'lucy',
        age: 16,
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('user', {});
  },
});
