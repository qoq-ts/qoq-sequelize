import { MigrationHelper, MigrationOptions } from './MigrationHelper';

export const migration = (options: MigrationOptions): MigrationHelper => {
  return new MigrationHelper(options);
};
