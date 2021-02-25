import { QueryInterface } from '../types/override/QueryInterface';

export interface MigrationOptions {
  up: (this: QueryInterface) => Promise<any>;
  down: (this: QueryInterface) => Promise<any>;
}

export class MigrationHelper {
  constructor(protected readonly options: MigrationOptions) {}

  transform(queryInterface: QueryInterface): MigrationOptions {
    return {
      up: () => this.options.up.call(queryInterface),
      down: () => this.options.down.call(queryInterface),
    };
  }
}
