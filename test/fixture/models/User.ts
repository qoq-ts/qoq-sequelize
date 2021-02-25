import { Op } from 'sequelize';
import { column, defineModel } from '../../../src';
import { Project } from './Project';
import { UserProject } from './UserProject';

export const User = defineModel({
  attributes: {
    id: column.int.primaryKey(),
    name: column.varChar.notNull().comment('User Name'),
    age: column.tinyInt.notNull(),
  },
  associations: {
    projects: () => User.hasMany(Project),
    projs: () => User.belongsToMany(Project, {
      through: UserProject,
      otherKey: 'project_id',
      foreignKey: 'user_id',
    }),
  },
  scopes: {
    withName: () => User.addScope({
      attributes: ['id', 'name'],
    }),
    limitAge: () => User.addScope((wrap, min: number, max: number) => wrap({
      where: {
        age: {
          [Op.between]: [min, max],
        }
      }
    })),
  },
  options: {
    setterMethods: {
      age(value) {
        this.setDataValue('age', value + 2);
      }
    }
  }
});
