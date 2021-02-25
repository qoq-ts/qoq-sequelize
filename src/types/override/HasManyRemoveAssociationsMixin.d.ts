import { InstanceUpdateOptions } from 'sequelize/types';

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
 *  removeRoles: Sequelize.HasManyRemoveAssociationsMixin<RoleInstance, RoleId>;
 *  // hasRole...
 *  // hasRoles...
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyRemoveAssociationsMixin<TModel, TModelPrimaryKey> = (
  oldAssociateds?: (TModel | TModelPrimaryKey)[],
  options?: HasManyRemoveAssociationsMixinOptions
) => Promise<void>;

/**
 * The options for the removeAssociations mixin of the hasMany association.
 * @see HasManyRemoveAssociationsMixin
 */
export interface HasManyRemoveAssociationsMixinOptions extends InstanceUpdateOptions<any> {}
