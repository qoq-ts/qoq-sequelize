import { Op } from 'sequelize';
import { column, defineModel } from '../../../src';
import { Project } from './Project';
import { UserProject } from './UserProject';

export const User = defineModel({
  attributes: {
    id: column.int.primaryKey().autoIncrement(),
    name: column.varChar.notNull().comment('User Name'),
    age: column.tinyInt.notNull(),
  },
  associations: {
    projects: () =>
      User.hasMany(Project, {
        foreignKey: 'userId',
      }),
    projs: () =>
      User.belongsToMany(Project, {
        through: UserProject,
        otherKey: 'project_id',
        foreignKey: 'user_id',
      }),
    projs1: () =>
      User.belongsToMany(Project, {
        through: {
          model: UserProject,
          scope: {
            project_id: 2,
          },
        },
        otherKey: 'project_id',
        foreignKey: 'user_id',
      }),
  },
  scopes: {
    withName: () =>
      User.addScope({
        attributes: ['id', 'name'],
      }),
    limitAge: () =>
      User.addScope((wrap, min: number, max: number) =>
        wrap({
          where: {
            age: {
              [Op.between]: [min, max],
            },
          },
        }),
      ),
  },
  options: {
    underscored: true,
  },
});
