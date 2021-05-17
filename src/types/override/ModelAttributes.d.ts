import { DataType } from 'sequelize';
import { Model } from './Model';
import { ModelAttributeColumnOptions } from './ModelAttributeColumnOptions';

/**
 * Interface for Attributes provided for a column
 */
export type ModelAttributes<M extends Model = Model, TCreationAttributes = any> = {
  /**
   * The description of a database column
   */
  [name in keyof TCreationAttributes]: DataType | ModelAttributeColumnOptions<M>;
};
