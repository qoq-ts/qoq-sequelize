import fs from 'fs';
import path from 'path';
import { ConsoleApplication } from 'qoq';
import { Sequelize } from '../../src';
import { createMeta } from '../../src/migration/createMeta';

const migrationsCount =
  fs.readdirSync(path.join(__dirname, '..', 'fixture', 'migrations')).length - 1;
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

it('migrate up all files', async () => {
  await app.execute('db:migrate');
  const meta = await Meta.findAll();
  const names = meta.map((item) => item.get('name'));

  expect(names).toHaveLength(migrationsCount);
  expect(names).toContain('001-createUser');
  expect(names).toContain('002-createProject');
});

it('migrate up with option to', async () => {
  await app.execute('db:migrate', '--to', '001-createUser');
  const meta = await Meta.findAll();
  const names = meta.map((item) => item.get('name'));
  expect(names).toHaveLength(1);
  expect(names).toContain('001-createUser');

  await sequelize.dropAllSchemas({});
  await app.execute('db:migrate', '--to', '002-createProject');
  expect(await Meta.findAll()).toHaveLength(2);

  await sequelize.dropAllSchemas({});
  await app.execute('db:migrate');
  expect(await Meta.findAll()).toHaveLength(migrationsCount);
});
