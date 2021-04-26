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

it ('migrate down with option --to', async () => {
  await app.execute('db:migrate');
  expect(await Meta.findAll()).toHaveLength(migrationsCount);

  try {
    await app.execute('db:migrate:undo:all', '--to', 'non-exists');
  } catch {}
  expect(await Meta.findAll()).toHaveLength(migrationsCount);

  await app.execute('db:migrate:undo:all', '--to', '002-createProject');
  expect(await Meta.findAll()).toHaveLength(1);

  try {
    await app.execute('db:migrate:undo:all', '--to', '001-createUser');
  } catch {}
  expect(await Meta.findAll()).toHaveLength(0);
});

it ('migrate down one by one', async () => {
  await app.execute('db:migrate');
  expect(await Meta.findAll()).toHaveLength(migrationsCount);

  await app.execute('db:migrate:undo');
  expect(await Meta.findAll()).toHaveLength(migrationsCount - 1);

  await app.execute('db:migrate:undo');
  expect(await Meta.findAll()).toHaveLength(migrationsCount - 2);
});

it ('migrate down for all files', async () => {
  await app.execute('db:migrate');
  expect(await Meta.findAll()).toHaveLength(migrationsCount);

  await app.execute('db:migrate:undo:all');
  expect(await Meta.findAll()).toHaveLength(0);
});
