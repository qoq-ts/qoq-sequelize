import path from 'path';
import glob from 'glob';
import { Umzug, SequelizeStorage, RunnableMigration } from 'umzug';
import { MigrationHelper } from './MigrationHelper';
import { SequelizeMeta } from './SequelizeMeta';
import { TemporaryModel } from '../model/TemporaryModel';
import { Sequelize } from '../model/Sequelize';
import { QueryInterface } from '../types/override/QueryInterface';

const parseMigrations = (dir: string): RunnableMigration<QueryInterface>[] => {
  const migrationList: RunnableMigration<QueryInterface>[] = [];

  glob.sync(path.resolve(dir, '**/!(*.d).{ts,js}')).forEach((fileName) => {
    const modules = require(fileName);
    const defaultModule = modules.default;

    if (defaultModule && defaultModule instanceof MigrationHelper) {
      migrationList.push({
        // Omit the extension to make name globally
        name: path.basename(fileName, path.extname(fileName)),
        ...defaultModule.execute(),
      });
    }
  });

  return migrationList;
};

const createStorage = (sequelize: Sequelize) => {
  return new SequelizeStorage({
    model: (SequelizeMeta as unknown as TemporaryModel).define(sequelize),
    columnName: 'name',
  });
};

const createUmzug = (sequelize: Sequelize, path: string): Umzug<QueryInterface> => {
  const umzug = new Umzug<QueryInterface>({
    migrations: parseMigrations(path),
    context: sequelize.getQueryInterface(),
    storage: createStorage(sequelize),
    logger: undefined,
  });

  registerEvents(umzug);

  return umzug;
}

export const createUmzugForMigration = (sequelize: Sequelize): Umzug<QueryInterface> => {
  return createUmzug(sequelize, sequelize.migrationsPath);
};

export const createUmzugForSeeder = (sequelize: Sequelize): Umzug<QueryInterface> => {
  return createUmzug(sequelize, sequelize.seedersPath);
};

const registerEvents = (umzug: Umzug<QueryInterface>) => {
  let time: number;

  umzug.on('migrating', (name) => {
    time = Date.now();
    console.log('== ' + name + ': migrating =======');
  });

  umzug.on('migrated', (name) => {
    console.log('== ' + name + ': migrated (' + (Date.now() - time) / 1000 + 's)');
  });

  umzug.on('reverting', (name) => {
    time = Date.now();
    console.log('== ' + name + ': reverting =======');
  });

  umzug.on('reverted', (name) => {
    console.log('== ' + name + ': reverted (' + (Date.now() - time) / 1000 + 's)');
  });
};
