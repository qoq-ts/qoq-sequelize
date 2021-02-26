import { join } from 'path';
import { Op } from 'sequelize';
import { Sequelize } from '../../src';
import { User } from '../fixture/models/User';

let sequelize: Sequelize;

beforeAll(() => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    modelsPath: join(__dirname, '..', 'fixture', 'models'),
  });
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

it ('can create record', async () => {
  const result = await User.create({
    name: 'test',
    age: 30,
  });

  expect(result.id).toBe(1);
  expect(result.name).toBe('test');
  expect(await User.count()).toBe(1);

  const project = await result.createProject({
    title: 'test123'
  });

  expect(project.userId).toBe(1);
  expect(project.title).toBe('test123');
});

it ('can find single record', async () => {
  let user = await User.findOne({
    attributes: ['id', 'age', 'name'],
    where: {
      id: 1,
    }
  });

  expect(user).toBeNull();

  await User.create({
    name: 'bob',
    age: 30,
  });

  user = await User.findOne({
    attributes: ['id', 'age', 'name'],
    where: {
      id: 1,
    }
  });

  // @ts-expect-error [user may be null]
  expect(user.name).toBe('bob');
  expect(user?.age).toBe(30);
});

it ('empty record will throw error', async () => {
  try {
    await User.findOne({
      rejectOnEmpty: true,
    });
    expect(true).toBeFalsy();
  } catch {
    return;
  }

  await User.create({
    name: 'test3',
    age: 20,
  });

  const user = await User.findOne({
    rejectOnEmpty: true,
  });

  expect(user.name.toUpperCase()).toBe('TEST3');
  expect(user.get('name').toUpperCase()).toBe('TEST3');
});

it ('can find multiple records', async () => {
  await User.bulkCreate([
    {
      name: 'ttst',
      age: 10,
    },
    {
      name: 'ttst',
      age: 20,
    }
  ]);

  const result = await User.findAll({
    attributes: ['id', 'name'],
    where: {
      id: {
        [Op.lt]: 5,
      }
    }
  });

  expect(result).toHaveLength(2);
  expect(result[0]?.name).toBe('ttst');
});
