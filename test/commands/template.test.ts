import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import { ConsoleApplication } from 'qoq';
import { Sequelize } from '../../src';

it('create migration file', async () => {
  const migrationsDir = path.resolve('node_modules', '.cache', 'migrations-' + Date.now());
  const tplContent = fs.readFileSync(path.resolve('./src/template/migration.tpl')).toString();
  const sequelize = new Sequelize({
    migrationsDir: migrationsDir,
    dialect: 'sqlite',
    logging: false,
  });

  const app = new ConsoleApplication();
  await sequelize.mountCommands(app);

  rimraf.sync(migrationsDir);

  await app.execute('migration:create', '--name', 'create-table-user');
  let files = fs.readdirSync(migrationsDir);
  expect(files.length).toEqual(1);
  expect(files[0]).toMatch(/^\d+-create-table-user.ts$/);
  expect(fs.readFileSync(path.join(migrationsDir, files[0]!)).toString()).toEqual(tplContent);

  rimraf.sync(migrationsDir);
  await app.execute('migration:generate', '--name', 'drop-table');
  files = fs.readdirSync(migrationsDir);
  expect(files.length).toEqual(1);
  expect(files[0]).toMatch(/^\d+-drop-table.ts$/);
  expect(fs.readFileSync(path.join(migrationsDir, files[0]!)).toString()).toEqual(tplContent);

  rimraf.sync(migrationsDir);
});

it('create seeder file', async () => {
  const seedersDir = path.resolve('node_modules', '.cache', 'seeders-' + Date.now());
  const tplContent = fs.readFileSync(path.resolve('./src/template/seed.tpl')).toString();
  const sequelize = new Sequelize({
    seedersDir: seedersDir,
    dialect: 'sqlite',
    logging: false,
  });

  const app = new ConsoleApplication();
  await sequelize.mountCommands(app);

  rimraf.sync(seedersDir);

  await app.execute('seed:create', '--name', 'create-seeder-user');
  let files = fs.readdirSync(seedersDir);
  expect(files.length).toEqual(1);
  expect(files[0]).toMatch(/^\d+-create-seeder-user.ts$/);
  expect(fs.readFileSync(path.join(seedersDir, files[0]!)).toString()).toEqual(tplContent);

  rimraf.sync(seedersDir);
  await app.execute('seed:generate', '--name', 'drop-seeder');
  files = fs.readdirSync(seedersDir);
  expect(files.length).toEqual(1);
  expect(files[0]).toMatch(/^\d+-drop-seeder.ts$/);
  expect(fs.readFileSync(path.join(seedersDir, files[0]!)).toString()).toEqual(tplContent);

  rimraf.sync(seedersDir);
});
