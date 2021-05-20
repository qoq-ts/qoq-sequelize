import { join } from 'path';
import * as umzug from 'umzug';
import { Sequelize } from '../../src';
import { createUmzugForMigration, createUmzugForSeeder } from '../../src/migration/createUmzug';

let sequelize: Sequelize;

beforeAll(() => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    migrationsDir: join(__dirname, '..', 'fixture', 'migrations'),
    seedersDir: join(__dirname, '..', 'fixture', 'seeders'),
    logging: false,
  });
});

afterAll(async () => {
  await sequelize.close();
});

it('can instance umzug', async () => {
  expect(await createUmzugForMigration(sequelize)).toBeInstanceOf(umzug.Umzug);
  expect(await createUmzugForSeeder(sequelize)).toBeInstanceOf(umzug.Umzug);
});

it('will log when migrating', async () => {
  const umzug = await createUmzugForMigration(sequelize);
  const spy = jest.spyOn(console, 'log');
  let message = '';

  spy.mockImplementation((msg: string) => {
    message += msg;
  });

  await umzug.up();

  expect(message).toContain('== 001-createUser: migrating');
  expect(message).toContain('== 001-createUser: migrated');
  expect(message).toContain('== 002-createProject: migrating');
  expect(message).toContain('== 002-createProject: migrated');
  expect(message).not.toContain('invalid_tb');

  message = '';
  await umzug.down({
    to: 0,
  });
  expect(message).toContain('== 001-createUser: reverting');
  expect(message).toContain('== 001-createUser: reverted');
  expect(message).toContain('== 002-createProject: reverting');
  expect(message).toContain('== 002-createProject: reverted');
  expect(message).not.toContain('invalid_tb');

  spy.mockRestore();
});

it('will log when migrating seeders', async () => {
  const spy = jest.spyOn(console, 'log');

  spy.mockImplementation(() => {});
  await (await createUmzugForMigration(sequelize)).up();

  const umzug = await createUmzugForSeeder(sequelize);

  let message = '';
  spy.mockImplementation((msg: string) => {
    message += msg;
  });

  await umzug.up();

  expect(message).toContain('== 001-user: migrating');
  expect(message).toContain('== 001-user: migrated');

  message = '';
  await umzug.down({
    to: 0,
  });
  expect(message).toContain('== 001-user: reverting');
  expect(message).toContain('== 001-user: reverted');

  spy.mockRestore();
});
