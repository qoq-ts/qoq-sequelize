import { column, defineModel, literal } from '../../../src';
import { User } from './User';

export const Project = defineModel({
  attributes: {
    id: column.int.primaryKey(),
    userId: column.int.notNull(),
    title: column.varChar.notNull(),
    description: column.varChar,
  },
  associations: {
    user: () =>
      Project.belongsTo(User, {
        foreignKey: 'userId',
      }),
  },
  scopes: {
    hasDesc: () =>
      Project.addScope({
        where: {
          description: literal('is not null'),
        },
      }),
  },
});
