import { ForeignKeyOptions } from './ForeignKeyOptions';
import { ManyToManyOptions } from './ManyToManyOptions';
import { Model } from './Model';
import { ModelType } from './ModelType';
import { ThroughOptions } from './ThroughOptions';

/**
 * ###############
 *
 * Omit: through.string
 *
 * ################
 */

/**
 * Options provided when associating models with belongsToMany relationship
 */
export interface BelongsToManyOptions<S extends Model, T extends Model, P extends Model>
  extends Omit<ManyToManyOptions<S, T>, 'foreignKey'> {
  /**
   * The name of the table that is used to join source and target in n:m associations. Can also be a
   * sequelize model if you want to define the junction table yourself and add extra attributes to it.
   */
  through: (new (...args: any[]) => P) /*| string*/ | ThroughOptions<P>;

  /**
   * The name of the foreign key in the join table (representing the target model) or an object representing
   * the type definition for the other column (see `Sequelize.define` for syntax). When using an object, you
   * can add a `name` property to set the name of the colum. Defaults to the name of target + primary key of
   * target
   */
  otherKey?: keyof P['_attributes'] | ForeignKeyOptions<P['_attributes']>;
  /**
   * The name of the foreign key in the join table. Defaults to the name of source + primary key
   */
  foreignKey?: keyof P['_attributes'] | ForeignKeyOptions<P['_attributes']>;

  /**
   * The name of the field to use as the key for the association in the source table. Defaults to the primary
   * key of the source table
   */
  sourceKey?: keyof S['_attributes'];

  /**
   * The name of the field to use as the key for the association in the target table. Defaults to the primary
   * key of the target table
   */
  targetKey?: keyof T['_attributes'];

  /**
   * Should the join model have timestamps
   */
  timestamps?: boolean;

  /**
   * The unique key name to override the autogenerated one when primary key is not present on through model
   */
  uniqueKey?: keyof P['_attributes'];
}
