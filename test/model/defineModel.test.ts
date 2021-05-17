import { DataTypes } from 'sequelize';
import { column, defineModel, Sequelize } from '../../src';
import { TemporaryModel } from '../../src/model/TemporaryModel';
import { Associate } from '../../src/types/custom/AssociationType';
import { Model } from '../../src/types/override/Model';
import { ModelCtor } from '../../src/types/override/ModelCtor';
import { ModelStatic } from '../../src/types/override/ModelStatic';
import { topic } from '../../src/util/topic';

let sequelize: Sequelize;

beforeEach(() => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
  });
});

afterEach(async () => {
  await sequelize.close();
});

const init = <M extends Model>(
  model: ModelStatic<M>,
  moduleName = 'User',
): ModelCtor<M, Associate<M['_type_assocs']>> => {
  (model as unknown as typeof TemporaryModel).__init(sequelize, moduleName);
  // @ts-ignore
  return model;
};

const modelsInitialized = () => {
  topic.publish('modelsInitialized', sequelize);
};

it('can create temporary model', () => {
  const User = defineModel({
    attributes: {},
  });

  expect(User.prototype).toBeInstanceOf(TemporaryModel);
});

it('can define attributes', () => {
  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      name: column.varChar.notNull(),
    },
  });

  expect(init(User).rawAttributes).toMatchObject({
    id: {
      field: 'id',
      type: DataTypes.INTEGER(),
      primaryKey: true,
    },
    name: {
      field: 'name',
      allowNull: false,
    },
  });
});

it('the tableName is default the snake case of model name', () => {
  const User = defineModel({
    attributes: {},
  });
  init(User, 'UserMe');

  expect(User.name).toBe('UserMe');
  expect(User.tableName).toBe('user_me');
});

it('table name will copy from model name', () => {
  const User = defineModel({
    attributes: {},
    options: {
      freezeTableName: true,
    },
  });
  init(User, 'UserMe');

  expect(User.name).toBe('UserMe');
  expect(User.tableName).toBe('UserMe');
});

it('can set table name manually', () => {
  const User = defineModel({
    attributes: {},
    options: {
      tableName: 'zzz',
    },
  });

  expect(init(User, 'UserMe').tableName).toBe('zzz');
});

it('can define scopes', () => {
  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      name: column.varChar.notNull(),
    },
    scopes: {
      test1: () =>
        User.addScope({
          attributes: ['name'],
        }),
      test2: () =>
        User.addScope((wrap) =>
          wrap({
            attributes: [
              'id',
              'name',
              // @ts-expect-error
              'is',
            ],
          }),
        ),
    },
  });

  init(User);
  modelsInitialized();

  expect(User.scope('test1')).toBeInstanceOf(Function);
  expect(User.scope(['test1', 'test2'])).toBeInstanceOf(Function);
  expect(User.scope({ method: ['test2'] })).toBeInstanceOf(Function);
  // @ts-expect-error
  expect(() => User.scope('non-exist')).toThrowError();
});

it('can define associations', () => {
  const Project = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      userId: column.int.notNull(),
      title: column.varChar.notNull(),
    },
    associations: {
      user: () =>
        Project.belongsTo(User, {
          targetKey: 'id',
          foreignKey: 'userId',
        }),
    },
  });

  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      name: column.varChar.notNull(),
    },
    associations: {
      projects: () =>
        User.hasMany(Project, {
          foreignKey: 'userId',
          sourceKey: 'id',
        }),
      projs: () =>
        User.hasMany(Project, {
          foreignKey: 'userId',
          sourceKey: 'id',
        }),
    },
  });

  init(User);
  init(Project);
  modelsInitialized();

  expect(User.associations).toHaveProperty('projects');
  expect(User.associations).toHaveProperty('projs');
  expect(Project.associations).toHaveProperty('user');
});

it('can use the association with prefix associate', () => {
  const Project = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      userId: column.int.notNull(),
      title: column.varChar.notNull(),
    },
    scopes: {
      test1: () =>
        Project.addScope({
          attributes: ['title'],
        }),
    },
  });

  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      name: column.varChar.notNull(),
    },
    associations: {
      projects: () =>
        User.hasMany(Project, {
          foreignKey: 'userId',
        }),
    },
  });

  init(User);
  init(Project, 'Project');
  modelsInitialized();

  expect(User.include.projects()).toMatchObject({
    association: User.associations['projects'],
  });
  expect(User.include.projects()).toMatchObject({
    association: User.associations['projects'],
  });
  expect(User.include.projects({ scope: 'test1' }).model).toBeInstanceOf(Function);
  // @ts-expect-error
  expect(() => User.include.projects({ scope: 'non-exist' })).toThrowError();
});
