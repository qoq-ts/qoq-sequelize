import path from 'path';
import { ConsoleApplication } from 'qoq';
import { Sequelize } from '../../src';

const sequelize = new Sequelize({
  modelsDir: path.join(__dirname, '..', 'fixture', 'models'),
  migrationsDir: path.join(__dirname, '..', 'fixture', 'migrations'),
  dialect: 'sqlite',
  logging: false,
});
const app = new ConsoleApplication();

beforeEach(async () => {
  await sequelize.dropAllSchemas({});
  // Reset the sequelize instance
  await sequelize.mountCommands(app);
});

it('migrate status', async () => {
  const spy = jest.spyOn(console, 'log');
  let message = '';

  spy.mockImplementation((msg: string) => {
    message += msg;
  });

  await app.execute('db:migrate:status');
  expect(message).not.toContain('up');
  expect(message).toContain('down');

  message = '';
  await app.execute('db:migrate');
  await app.execute('db:migrate:status');
  expect(message).toContain('up');
  expect(message).not.toContain('down');

  spy.mockRestore();
});
