import { FindOptions } from './FindOptions';

/**
 * The getAssociations mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasMany(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  getRoles: Sequelize.HasManyGetAssociationsMixin<RoleInstance>;
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
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyGetAssociationsMixin<TModel> = (options?: HasManyGetAssociationsMixinOptions) => Promise<TModel[]>;

/**
 * The options for the getAssociations mixin of the hasMany association.
 * @see HasManyGetAssociationsMixin
 */
export interface HasManyGetAssociationsMixinOptions extends FindOptions<any> {
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | string[] | boolean;
}
