import { DataType } from 'sequelize';
import { AssociationOptions } from './AssociationOptions';
import { ForeignKeyOptions } from './ForeignKeyOptions';
import { Model } from './Model';

/**
 * ##################
 *
 * Rewrite: foreignKey
 *
 * ###################
 */

/**
 * Options provided when associating models with belongsTo relationship
 *
 * @see Association class belongsTo method
 */
export interface BelongsToOptions<S extends Model, T extends Model>
  extends Omit<AssociationOptions<S, T>, 'foreignKey'> {
  /**
   * The name of the field to use as the key for the association in the target table. Defaults to the primary
   * key of the target table
   */
  targetKey?: keyof T['_attributes'];

  /**
   * The name of the field to use as the key for the association in the source table.
   */
  foreignKey?: keyof S['_attributes'] | ForeignKeyOptions<S['_attributes']>;

  /**
   * A string or a data type to represent the identifier in the table
   */
  keyType?: DataType;
}
