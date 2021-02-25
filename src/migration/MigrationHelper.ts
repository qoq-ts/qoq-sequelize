import { RunnableMigration } from 'umzug';
import { QueryInterface } from '../types/override/QueryInterface';

export interface MigrationOptions {
  up: (this: undefined, queryInterface: QueryInterface) => Promise<any>;
  down: (this: undefined, queryInterface: QueryInterface) => Promise<any>;
}

export class MigrationHelper {
  constructor(protected readonly options: MigrationOptions) {}

  execute(): Pick<RunnableMigration<QueryInterface>, 'up' | 'down'> {
    return {
      up: ({ context }) => this.options.up.call(undefined, context),
      down: ({ context }) => this.options.down.call(undefined, context),
    };
  }
}
