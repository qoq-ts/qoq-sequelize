import { InstanceUpdateOptions } from 'sequelize/types';
import { FindOptions } from './FindOptions';

/**
 * The setAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasMany(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRoles...
 *  setRoles: Sequelize.HasManySetAssociationsMixin<RoleInstance, RoleId>;
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
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManySetAssociationsMixin<TModel, TModelPrimaryKey> = (
  newAssociations?: (TModel | TModelPrimaryKey)[],
  options?: HasManySetAssociationsMixinOptions
) => Promise<void>;

/**
 * The options for the setAssociations mixin of the hasMany association.
 * @see HasManySetAssociationsMixin
 */
export interface HasManySetAssociationsMixinOptions extends FindOptions<any>, InstanceUpdateOptions<any> {}
