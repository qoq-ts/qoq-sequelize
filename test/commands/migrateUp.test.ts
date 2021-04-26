import fs from 'fs';
import path from 'path';
import { ConsoleApplication } from 'qoq';
import { Sequelize } from '../../src';
import { createMeta } from '../../src/migration/createMeta';

const migrationsCount = fs.readdirSync(path.join(__dirname, '..', 'fixture', 'migrations')).length - 1;
const sequelize = new Sequelize({
  modelsDir: path.join(__dirname, '..', 'fixture', 'models'),
  migrationsDir: path.join(__dirname, '..', 'fixture', 'migrations'),
  dialect: 'sqlite',
  logging: false,
});
const Meta = createMeta(sequelize, 'TempMeta');
const app = new ConsoleApplication();

beforeEach(async () => {
  await sequelize.dropAllSchemas({});
  // Reset the sequelize instance
  await sequelize.mountCommands(app);
});

it ('migrate up all files', async () => {
  await app.execute('db:migrate');
  const meta = await Meta.findAll();
  const names = meta.map((item) => item.get('name'));

  expect(names).toHaveLength(migrationsCount);
  expect(names).toContain('001-createUser');
  expect(names).toContain('002-createProject');
});

it ('migrate up with option from-to', async () => {
  await app.execute('db:migrate', '--from', '001-createUser', '--to', '003-createCard');
  const meta = await Meta.findAll();
  const names = meta.map((item) => item.get('name'));
  expect(names).toHaveLength(3);
  expect(names).toContain('001-createUser');

  await sequelize.dropAllSchemas({});
  await app.execute('db:migrate', '--from', '001-createUser');
  expect(await Meta.findAll()).toHaveLength(3);

  await sequelize.dropAllSchemas({});
  await app.execute('db:migrate', '--to', '003-createCard');
  expect(await Meta.findAll()).toHaveLength(3);

  await sequelize.dropAllSchemas({});
  await app.execute('db:migrate');
  expect(await Meta.findAll()).toHaveLength(migrationsCount);
});
