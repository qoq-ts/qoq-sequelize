import { MigrationHelper, MigrationOptions } from './MigrationHelper';

export const seed = (options: MigrationOptions): MigrationHelper => {
  return new MigrationHelper(options);
};
