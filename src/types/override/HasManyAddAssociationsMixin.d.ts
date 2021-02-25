import { InstanceUpdateOptions } from 'sequelize/types';

/**
 * The addAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasMany(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRoles...
 *  // setRoles...
 *  addRoles: Sequelize.HasManyAddAssociationsMixin<RoleInstance, RoleId>;
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
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyAddAssociationsMixin<TModel, TModelPrimaryKey> = (
  newAssociations?: (TModel | TModelPrimaryKey)[],
  options?: HasManyAddAssociationsMixinOptions
) => Promise<void>;

/**
 * The options for the addAssociations mixin of the hasMany association.
 * @see HasManyAddAssociationsMixin
 */
export interface HasManyAddAssociationsMixinOptions extends InstanceUpdateOptions<any> {}
