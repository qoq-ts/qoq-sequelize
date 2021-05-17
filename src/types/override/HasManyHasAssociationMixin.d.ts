import { HasManyGetAssociationsMixinOptions } from './HasManyGetAssociationsMixin';

/**
 * The hasAssociation mixin applied to models with hasMany.
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
 *  hasRole: Sequelize.HasManyHasAssociationMixin<RoleInstance, RoleId>;
 *  // hasRoles...
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyHasAssociationMixin<TModel, TModelPrimaryKey> = (
  target: TModel | TModelPrimaryKey,
  options?: HasManyHasAssociationMixinOptions,
) => Promise<boolean>;

/**
 * The options for the hasAssociation mixin of the hasMany association.
 * @see HasManyHasAssociationMixin
 */
export interface HasManyHasAssociationMixinOptions extends HasManyGetAssociationsMixinOptions {}
