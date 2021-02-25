import { InstanceUpdateOptions } from 'sequelize/types';

/**
 * The addAssociation mixin applied to models with hasMany.
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
 *  addRole: Sequelize.HasManyAddAssociationMixin<RoleInstance, RoleId>;
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
export type HasManyAddAssociationMixin<TModel, TModelPrimaryKey> = (
  newAssociation?: TModel | TModelPrimaryKey,
  options?: HasManyAddAssociationMixinOptions
) => Promise<void>;

/**
 * The options for the addAssociation mixin of the hasMany association.
 * @see HasManyAddAssociationMixin
 */
export interface HasManyAddAssociationMixinOptions extends InstanceUpdateOptions<any> {}
