import { DataType } from 'sequelize/types';
import { AssociationOptions } from './AssociationOptions';
import { Model } from './Model';

/**
 * Options provided when associating models with hasOne relationship
 */
export interface HasOneOptions<S extends Model, T extends Model> extends AssociationOptions<S, T> {
  /**
   * The name of the field to use as the key for the association in the source table. Defaults to the primary
   * key of the source table
   */
  sourceKey?: keyof S['_attributes'];

  /**
   * A string or a data type to represent the identifier in the table
   */
  keyType?: DataType;
}
