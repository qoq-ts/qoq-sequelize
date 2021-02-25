import { InstanceUpdateOptions } from 'sequelize/types';

/**
 * The removeAssociation mixin applied to models with hasMany.
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
 *  removeRole: Sequelize.HasManyRemoveAssociationMixin<RoleInstance, RoleId>;
 *  // removeRoles...
 *  // hasRole...
 *  // hasRoles...
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyRemoveAssociationMixin<TModel, TModelPrimaryKey> = (
  oldAssociated?: TModel | TModelPrimaryKey,
  options?: HasManyRemoveAssociationMixinOptions
) => Promise<void>;

/**
 * The options for the removeAssociation mixin of the hasMany association.
 * @see HasManyRemoveAssociationMixin
 */
export interface HasManyRemoveAssociationMixinOptions extends InstanceUpdateOptions<any> {}
