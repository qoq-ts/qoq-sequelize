import { DataTypes } from 'sequelize';
import { KeepToken } from 'topic';
import { column, defineModel, Sequelize } from '../../src';
import { TemporaryModel } from '../../src/model/TemporaryModel';
import { Associate } from '../../src/types/custom/AssociationType';
import { Model } from '../../src/types/override/Model';
import { ModelCtor } from '../../src/types/override/ModelCtor';
import { ModelStatic } from '../../src/types/override/ModelStatic';
import { topic } from '../../src/util/topic';

let sequelize: Sequelize;
let token: KeepToken;

beforeEach(() => {
  token = topic.keep('modelsInitialized', true);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
  });
});

afterEach(async () => {
  token.release();
  await sequelize.close();
});

const define = <M extends Model>(model: ModelStatic<M>, moduleName = 'User'): ModelCtor<M, Associate<M['_type_assocs']>> => {
  const realModel = (model as unknown as TemporaryModel).updateModelName(moduleName).define(sequelize);

  // @ts-ignore
  return realModel;
};

it ('can create temporary model', () => {
  const User = defineModel({
    attributes: {}
  });

  expect(User).toBeInstanceOf(TemporaryModel);
});

it ('can define attributes', () => {
  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      name: column.varChar.notNull(),
    }
  });

  expect(define(User).rawAttributes).toMatchObject({
    id: {
      field: 'id',
      type: DataTypes.INTEGER(),
      primaryKey: true,
    },
    name: {
      field: 'name',
      allowNull: false,
    }
  });
});

it ('the tableName is default the snake case of model name', () => {
  const User = defineModel({
    attributes: {},
  });
  const Defined = define(User, 'UserMe');

  expect(Defined.name).toBe('UserMe');
  expect(Defined.tableName).toBe('user_me');
});

it ('table name will copy from model name', () => {
  const User = defineModel({
    attributes: {},
    options: {
      freezeTableName: true,
    }
  });
  const Defined = define(User, 'UserMe');

  expect(Defined.name).toBe('UserMe');
  expect(Defined.tableName).toBe('UserMe');
});

it ('can set table name manually', () => {
  const User = defineModel({
    attributes: {},
    options: {
      tableName: 'zzz',
    }
  });

  expect(define(User, 'UserMe').tableName).toBe('zzz');
});

it ('define model without model name will throw error', () => {
  const User = defineModel({
    attributes: {},
  });

  expect(() => (User as unknown as TemporaryModel).define(sequelize)).toThrowError();
});

it ('can define scopes', () => {
  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      name: column.varChar.notNull(),
    },
    scopes: {
      test1: () => User.addScope({
        attributes: ['name'],
      }),
      test2: () => User.addScope((wrap) => wrap({
        attributes: [
          'id',
          'name',
          // @ts-expect-error
          'is',
        ],
      })),
    }
  });

  define(User);

  expect(User.scope('test1')).toBeInstanceOf(Function);
  expect(User.scope(['test1', 'test2'])).toBeInstanceOf(Function);
  expect(User.scope({ method: ['test2'] })).toBeInstanceOf(Function);
  // @ts-expect-error
  expect(() => User.scope('non-exist')).toThrowError();
});

it ('can define associations', () => {
  const Project = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      userId: column.int.notNull(),
      title: column.varChar.notNull(),
    },
    associations: {
      user: () => Project.belongsTo(UserModel, {
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
      projects: () => User.hasMany(ProjectModel, {
        foreignKey: 'userId',
        sourceKey: 'id',
      }),
      projs: () => User.hasMany(ProjectModel, {
        foreignKey: 'userId',
        sourceKey: 'id',
      }),
    },
  });

  token.release();
  const UserModel = define(User);
  const ProjectModel = define(Project);
  topic.publish('modelsInitialized');

  expect(UserModel.associations).toHaveProperty('projects');
  expect(UserModel.associations).toHaveProperty('projs');
  expect(ProjectModel.associations).toHaveProperty('user');
});

it ('can use the association with prefix associate', () => {
  const Project = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      userId: column.int.notNull(),
      title: column.varChar.notNull(),
    },
    scopes: {
      test1: () => Project.addScope({
        attributes: ['title'],
      })
    }
  });

  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
      name: column.varChar.notNull(),
    },
    associations: {
      projects: () => User.hasMany(ProjectModel, {
        foreignKey: 'userId',
      }),
    },
  });

  token.release();
  const UserModel = define(User);
  const ProjectModel = define(Project);
  topic.publish('modelsInitialized');

  expect(UserModel.include.projects()).toMatchObject({
    model: ProjectModel,
    as: 'projects',
  });
  expect(User.include.projects()).toMatchObject({
    model: ProjectModel,
    as: 'projects',
  });
  expect(User.include.projects({ scope: 'test1' }).model).toBeInstanceOf(Function);
  // @ts-expect-error
  expect(() => User.include.projects({ scope: 'non-exist' })).toThrowError();
});
