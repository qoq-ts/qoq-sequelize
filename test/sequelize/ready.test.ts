import { tmpdir } from 'os';
import { join } from 'path';
import { ConsoleApplication } from 'qoq';
import { Sequelize } from '../../src';
import { User } from '../fixture/models/User';

const storage = join(tmpdir(), Date.now() + Math.random() + '.db');

beforeAll(async () => {
  const app = new ConsoleApplication();
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    migrationsDir: join(__dirname, '..', 'fixture', 'migrations'),
    storage,
  });

  sequelize.mountCommands(app);
  await app.execute('db:migrate');
});

it ('cannot operate the model before sequelize is initialized', async () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    modelsDir: join(__dirname, '..', 'fixture', 'models'),
    storage,
  });

  try {
    await User.create({
      name: 'x',
      age: 10,
    });
    expect(true).toBeFalsy();
  } catch {
    expect(true).toBeTruthy();
  }

  await sequelize.waitReady();

  await User.create({
    name: 'x',
    age: 10,
  });
});
