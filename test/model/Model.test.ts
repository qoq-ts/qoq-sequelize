import { join } from 'path';
import { Op } from 'sequelize';
import { Sequelize } from '../../src';
import { User } from '../fixture/models/User';

let sequelize: Sequelize;

beforeAll(async () => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    modelsDir: join(__dirname, '..', 'fixture', 'models'),
    logging: false,
  });
  await sequelize.ready();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

it('can create record', async () => {
  const result = await User.create({
    name: 'test',
    age: 30,
  });

  expect(result.id).toBe(1);
  expect(result.name).toBe('test');
  expect(await User.count()).toBe(1);

  const project = await result.createProject({
    title: 'test123',
  });

  expect(project.userId).toBe(1);
  expect(project.title).toBe('test123');
});

it('can find single record', async () => {
  let user = await User.findOne({
    attributes: ['id', 'age', 'name'],
    where: {
      id: 1,
    },
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
    },
  });

  // @ts-expect-error [user may be null]
  expect(user.name).toBe('bob');
  expect(user?.age).toBe(30);
});

it('empty record will throw error', async () => {
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

it('can find multiple records', async () => {
  await User.bulkCreate([
    {
      name: 'ttst',
      age: 10,
    },
    {
      name: 'ttst',
      age: 20,
    },
  ]);

  const result = await User.findAll({
    attributes: ['id', 'name'],
    where: {
      id: {
        [Op.lt]: 5,
      },
    },
  });

  expect(result).toHaveLength(2);
  expect(result[0]?.name).toBe('ttst');
});

it('can use order helper to sort result', async () => {
  await User.bulkCreate([
    {
      name: 'ttst',
      age: 10,
    },
    {
      name: 'ttst',
      age: 20,
    },
  ]);

  let result = await User.findAll({
    order: [User.order.asc('age')],
  });
  expect(result[0]!.age).toBe(10);

  result = await User.findAll({
    order: [User.order.desc('age')],
  });
  expect(result[0]!.age).toBe(20);
});

it('order helper can invoke deeply', async () => {
  const user = await User.create({
    name: 'ttst',
    age: 10,
  });

  await user.createProject({
    title: 'zz',
  });

  await user.createProject({
    title: 'bb',
  });

  await user.createProject({
    title: 'cc',
  });

  const result = await User.findAll({
    include: [User.include.projects()],
    order: [User.order.projects.asc('title')],
  });

  expect(result[0]!.projects[0]!.title).toBe('bb');
  expect(result[0]!.projects[1]!.title).toBe('cc');
  expect(result[0]!.projects[2]!.title).toBe('zz');
});
