import { AssociationOptions } from './AssociationOptions';
import { AssociationScope } from './AssociationScope';
import { Model } from './Model';

/**
 * Options provided for many-to-many relationships
 */
export interface ManyToManyOptions<S extends Model, T extends Model> extends AssociationOptions<S, T> {
  /**
   * A key/value set that will be used for association create and find defaults on the target.
   * (sqlite not supported for N:M)
   */
  scope?: AssociationScope<T['_attributes']>;
}
