import { Hookable, Logging, Transactionable } from 'sequelize/types';
import { Includeable } from './Includeable';

/**
 * Options for Model.bulkCreate method
 */
export interface BulkCreateOptions<TAttributes = any> extends Logging, Transactionable, Hookable {
  /**
   * Fields to insert (defaults to all fields)
   */
  fields?: (keyof TAttributes)[];

  /**
   * Should each row be subject to validation before it is inserted. The whole insert will fail if one row
   * fails validation
   */
  validate?: boolean;

  /**
   * Run before / after create hooks for each individual Instance? BulkCreate hooks will still be run if
   * options.hooks is true.
   */
  individualHooks?: boolean;

  /**
   * Ignore duplicate values for primary keys? (not supported by postgres)
   *
   * @default false
   */
  ignoreDuplicates?: boolean;

  /**
   * Fields to update if row key already exists (on duplicate key update)? (only supported by MySQL,
   * MariaDB, SQLite >= 3.24.0 & Postgres >= 9.5). By default, all fields are updated.
   */
  updateOnDuplicate?: (keyof TAttributes)[];

  /**
   * Include options. See `find` for details
   */
  include?: Includeable | Includeable[];

  /**
   * Return all columns or only the specified columns for the affected rows (only for postgres)
   */
  returning?: boolean | (keyof TAttributes)[];
}
