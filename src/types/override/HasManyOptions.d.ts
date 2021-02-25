import { DataType } from 'sequelize';
import { ManyToManyOptions } from './ManyToManyOptions';
import { Model } from './model';

/**
 * Options provided when associating models with hasMany relationship
 */
export interface HasManyOptions<S extends Model, T extends Model> extends ManyToManyOptions<S, T> {

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
