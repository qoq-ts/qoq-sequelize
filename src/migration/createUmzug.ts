import path from 'path';
import glob from 'glob';
import { Umzug, SequelizeStorage, RunnableMigration } from 'umzug';
import { MigrationHelper } from './MigrationHelper';
import { Sequelize } from '../model/Sequelize';
import { QueryInterface } from '../types/override/QueryInterface';
import { createMeta } from './createMeta';

const parseMigrations = async (dir: string): Promise<RunnableMigration<QueryInterface>[]> => {
  const migrationList: RunnableMigration<QueryInterface>[] = [];

  await Promise.all(
    glob.sync(path.resolve(dir, '**', '!(*.d).{ts,js}')).map(async (fileName) => {
      const modules = await import(fileName);
      const defaultModule = modules.default;

      if (defaultModule && defaultModule instanceof MigrationHelper) {
        migrationList.push({
          // Omit the extension to make name globally
          name: path.basename(fileName, path.extname(fileName)),
          ...defaultModule.execute(),
        });
      }
    })
  );

  return migrationList;
};

const createStorage = (sequelize: Sequelize) => {
  return new SequelizeStorage({
    model: createMeta(sequelize),
    columnName: 'name',
  });
};

const createUmzug = async (sequelize: Sequelize, path: string): Promise<Umzug<QueryInterface>> => {
  const umzug = new Umzug<QueryInterface>({
    migrations: await parseMigrations(path),
    context: sequelize.getQueryInterface(),
    storage: createStorage(sequelize),
    logger: undefined,
  });

  registerEvents(umzug);

  return umzug;
}

export const createUmzugForMigration = (sequelize: Sequelize): Promise<Umzug<QueryInterface>> => {
  return createUmzug(sequelize, sequelize.migrationsPath);
};

export const createUmzugForSeeder = (sequelize: Sequelize): Promise<Umzug<QueryInterface>> => {
  return createUmzug(sequelize, sequelize.seedersPath);
};

const registerEvents = (umzug: Umzug<QueryInterface>) => {
  let time: number;

  umzug.on('migrating', (data) => {
    time = Date.now();
    console.log('== ' + data.name + ': migrating =======');
  });

  umzug.on('migrated', (data) => {
    console.log('== ' + data.name + ': migrated (' + (Date.now() - time) / 1000 + 's)');
  });

  umzug.on('reverting', (data) => {
    time = Date.now();
    console.log('== ' + data.name + ': reverting =======');
  });

  umzug.on('reverted', (data) => {
    console.log('== ' + data.name + ': reverted (' + (Date.now() - time) / 1000 + 's)');
  });
};
