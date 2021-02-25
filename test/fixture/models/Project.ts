import { column, defineModel, literal } from '../../../src';
import { User } from './User';
import { UserProject } from './UserProject';

export const Project = defineModel({
  attributes: {
    id: column.int.primaryKey(),
    user_id: column.int.notNull(),
    title: column.varChar.notNull(),
    description: column.varChar,
  },
  associations: {
    user: () => Project.belongsToMany(User, {
      through: UserProject,
      otherKey: 'project_id',
      foreignKey: 'user_id',
    }),
  },
  scopes: {
    hasDesc: () => Project.addScope({
      where: {
        description: literal('is not null'),
      },
    })
  },
});
