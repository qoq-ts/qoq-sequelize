import { join } from 'path';
import { ConsoleApplication } from 'qoq';
//import { Model } from 'sequelize';
import { Sequelize } from '../../src';
import { TemporaryModel } from '../../src/model/TemporaryModel';
import { Project } from '../fixture/models/Project';
import { User } from '../fixture/models/User';

it ('can search models path', async () => {
  expect(Project.prototype).toBeInstanceOf(TemporaryModel);
  expect(User.prototype).toBeInstanceOf(TemporaryModel);

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    modelsDir: join(__dirname, '..', 'fixture', 'models'),
  });

  expect(Project).toBeInstanceOf(Function);
  expect(User).toBeInstanceOf(Function);

  await sequelize.close();
});

it ('can mount commands to app', async () => {
  const app = new ConsoleApplication({
    commandsPath: [],
  });
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    modelsDir: join(__dirname, '..', 'fixture', 'models'),
  });

  const spy = jest.spyOn(console, 'log');
  let message = '';

  spy.mockImplementation((msg) => {
    message = msg;
  });

  await app.execute('-h');
  expect(message).not.toContain('db:migrate');

  await sequelize.mountCommands(app);
  await app.execute('-h');
  expect(message).toContain('db:migrate');

  spy.mockRestore();
  await sequelize.close();
});
