import { Hookable, Logging, Silent, Transactionable } from 'sequelize/types';
import { BuildOptions } from './BuildOptions';

/**
 * Options for Model.create method
 */
export interface CreateOptions<TAttributes = any> extends BuildOptions, Logging, Silent, Transactionable, Hookable {
  /**
   * If set, only columns matching those in fields will be saved
   */
  fields?: (keyof TAttributes)[];

  /**
   * On Duplicate
   */
  onDuplicate?: string;

  /**
   * If false, validations won't be run.
   *
   * @default true
   */
  validate?: boolean;

}
