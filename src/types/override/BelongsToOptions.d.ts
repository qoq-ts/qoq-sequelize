// import { BelongsToOptions } from 'sequelize';

import { DataType } from 'sequelize';
import { AssociationOptions } from './AssociationOptions';
import { Model } from './model';

/**
 * Options provided when associating models with belongsTo relationship
 *
 * @see Association class belongsTo method
 */
export interface BelongsToOptions<S extends Model, T extends Model> extends AssociationOptions<S, T> {
  /**
   * The name of the field to use as the key for the association in the target table. Defaults to the primary
   * key of the target table
   */
  targetKey?: keyof T['_attributes'];

  /**
   * A string or a data type to represent the identifier in the table
   */
  keyType?: DataType;
}
