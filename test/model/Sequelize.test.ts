import { join } from 'path';
import { ConsoleApplication } from 'qoq';
//import { Model } from 'sequelize';
import { Sequelize } from '../../src';
import { TemporaryModel } from '../../src/model/TemporaryModel';
import { Project } from '../fixture/models/Project';
import { User } from '../fixture/models/User';

it ('can search models path', async () => {
  expect(Project).toBeInstanceOf(TemporaryModel);
  expect(User).toBeInstanceOf(TemporaryModel);

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    modelsDir: join(__dirname, '..', 'fixture', 'models'),
  });

  expect(Project).toBeInstanceOf(Function);
  expect(User).toBeInstanceOf(Function);

  await sequelize.close();
});

it ('one file only contains one model', () => {
  expect(() => new Sequelize({
    dialect: 'sqlite',
    modelsDir: join(__dirname, '..', 'fixture', 'bad-models'),
  })).toThrowError();
});

it ('can mount commands to app', async () => {
  const app = new ConsoleApplication({
    routerDir: [],
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

  await app.run('-h');
  expect(message).not.toContain('db:migrate');

  sequelize.mountCommands(app);
  await app.run('-h');
  expect(message).toContain('db:migrate');

  spy.mockRestore();
  await sequelize.close();
});
