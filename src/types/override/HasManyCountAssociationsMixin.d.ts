import { Filterable, Transactionable } from 'sequelize/types';

/**
 * The countAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasMany(Role);
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
 *  countRoles: Sequelize.HasManyCountAssociationsMixin;
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyCountAssociationsMixin = (
  options?: HasManyCountAssociationsMixinOptions,
) => Promise<number>;

/**
 * The options for the countAssociations mixin of the hasMany association.
 * @see HasManyCountAssociationsMixin
 */
export interface HasManyCountAssociationsMixinOptions extends Transactionable, Filterable<any> {
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | boolean;
}
