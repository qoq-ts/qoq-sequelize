import path from 'path';
import * as umzug from 'umzug';
import { MigrationHelper } from './MigrationHelper';
import { Sequelize } from '../model/Sequelize';
import { QueryInterface } from '../types/override/QueryInterface';
import { createMeta } from './createMeta';
import { finder } from 'qoq';

const parseMigrations = async (dir: string): Promise<umzug.RunnableMigration<QueryInterface>[]> => {
  const migrationList: umzug.RunnableMigration<QueryInterface>[] = [];
  const matches = await finder(finder.normalize(dir));

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
    }),
  );

  return migrationList;
};

export const createUmzugForMigration = async (
  sequelize: Sequelize,
): Promise<umzug.Umzug<QueryInterface>> => {
  const instance = new umzug.Umzug<QueryInterface>({
    migrations: await parseMigrations(sequelize.migrationsPath),
    context: sequelize.getQueryInterface(),
    storage: new umzug.SequelizeStorage({
      model: createMeta(sequelize),
      columnName: 'name',
    }),
    logger: undefined,
  });

  registerEvents(instance);
  return instance;
};

export const createUmzugForSeeder = async (
  sequelize: Sequelize,
): Promise<umzug.Umzug<QueryInterface>> => {
  const instance = new umzug.Umzug<QueryInterface>({
    migrations: await parseMigrations(sequelize.seedersPath),
    context: sequelize.getQueryInterface(),
    storage: umzug.memoryStorage(),
    logger: undefined,
  });

  registerEvents(instance);
  return instance;
};

const registerEvents = (umzug: umzug.Umzug<QueryInterface>) => {
  let time: number;

  umzug.on('migrating', (data) => {
    time = Date.now();
    console.log('== ' + data.name + ': migrating =======');
  });

  umzug.on('migrated', (data) => {
    console.log('== ' + data.name + ': migrated (' + getUsedTime(time) + ')');
  });

  umzug.on('reverting', (data) => {
    time = Date.now();
    console.log('== ' + data.name + ': reverting =======');
  });

  umzug.on('reverted', (data) => {
    console.log('== ' + data.name + ': reverted (' + getUsedTime(time) + ')');
  });
};

const getUsedTime = (fromTime: number) => ((Date.now() - fromTime) / 1000).toFixed(3) + 's';
