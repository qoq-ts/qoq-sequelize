import { FindAttributeOptions } from './FindAttributeOptions';
import { FindOptions } from './FindOptions';
import { Model } from './Model';

/**
 * The getAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  getRoles: Sequelize.BelongsToManyGetAssociationsMixin<RoleInstance>;
 *  // setRoles...
 *  // addRoles...
 *  // addRole...
 *  // createRole...
 *  // removeRole...
 *  // removeRoles...
 *  // hasRole...
 *  // hasRoles...
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html
 * @see Instance
 */
export type BelongsToManyGetAssociationsMixin<M extends Model> = (
  options?: BelongsToManyGetAssociationsMixinOptions<M['_attributes']>
) => Promise<M[]>;

/**
 * The options for the getAssociations mixin of the belongsToMany association.
 * @see BelongsToManyGetAssociationsMixin
 */
export interface BelongsToManyGetAssociationsMixinOptions<Attrs> extends FindOptions<Attrs> {
  /**
   * A list of the attributes from the join table that you want to select.
   */
  joinTableAttributes?: FindAttributeOptions<keyof Attrs>
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | boolean;
}
