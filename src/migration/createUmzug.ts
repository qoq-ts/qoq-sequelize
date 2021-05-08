import path from 'path';
import { Umzug, SequelizeStorage, RunnableMigration, memoryStorage } from 'umzug';
import { MigrationHelper } from './MigrationHelper';
import { Sequelize } from '../model/Sequelize';
import { QueryInterface } from '../types/override/QueryInterface';
import { createMeta } from './createMeta';
import { finder } from 'qoq';

const parseMigrations = async (dir: string): Promise<RunnableMigration<QueryInterface>[]> => {
  const migrationList: RunnableMigration<QueryInterface>[] = [];
  const matches = await finder(finder.normalize(finder.resolve(dir)));

  await Promise.all(
    matches.map(async (fileName) => {
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

export const createUmzugForMigration = async (sequelize: Sequelize): Promise<Umzug<QueryInterface>> => {
  const umzug = new Umzug<QueryInterface>({
    migrations: await parseMigrations(sequelize.migrationsPath),
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
      model: createMeta(sequelize),
      columnName: 'name',
    }),
    logger: undefined,
  });

  registerEvents(umzug);
  return umzug;
};

export const createUmzugForSeeder = async (sequelize: Sequelize): Promise<Umzug<QueryInterface>> => {
  const umzug = new Umzug<QueryInterface>({
    migrations: await parseMigrations(sequelize.seedersPath),
    context: sequelize.getQueryInterface(),
    storage: memoryStorage(),
    logger: undefined,
  });

  registerEvents(umzug);
  return umzug;
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
