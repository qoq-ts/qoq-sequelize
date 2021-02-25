import { Filterable, Transactionable } from 'sequelize';

/**
 * The countAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRoles...
 *  // setRoles...
 *  // addRoles...
 *  // addRole...
 *  // createRole...
 *  // removeRole...
 *  // removeRoles...
 *  // hasRole...
 *  // hasRoles...
 *  countRoles: Sequelize.BelongsToManyCountAssociationsMixin;
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html
 * @see Instance
 */
export type BelongsToManyCountAssociationsMixin = (
  options?: BelongsToManyCountAssociationsMixinOptions
) => Promise<number>;

/**
 * The options for the countAssociations mixin of the belongsToMany association.
 * @see BelongsToManyCountAssociationsMixin
 */
export interface BelongsToManyCountAssociationsMixinOptions extends Transactionable, Filterable<any> {
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | boolean;
}
