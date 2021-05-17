import { HasManyGetAssociationsMixinOptions } from './HasManyGetAssociationsMixin';

/**
 * The removeAssociations mixin applied to models with hasMany.
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
 *  // removeRoles
 *  // hasRole...
 *  hasRoles: Sequelize.HasManyHasAssociationsMixin<RoleInstance, RoleId>;
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyHasAssociationsMixin<TModel, TModelPrimaryKey> = (
  targets: (TModel | TModelPrimaryKey)[],
  options?: HasManyHasAssociationsMixinOptions,
) => Promise<boolean>;

/**
 * The options for the hasAssociations mixin of the hasMany association.
 * @see HasManyHasAssociationsMixin
 */
export interface HasManyHasAssociationsMixinOptions extends HasManyGetAssociationsMixinOptions {}
