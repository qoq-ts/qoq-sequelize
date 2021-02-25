import { FindOptions } from './FindOptions';

/**
 * The getAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasOne(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttrib>, UserAttrib {
 *  getRole: Sequelize.HasOneGetAssociationMixin<RoleInstance>;
 *  // setRole...
 *  // createRole...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-one.js~HasOne.html
 * @see Instance
 */
export type HasOneGetAssociationMixin<TModel> = (options?: HasOneGetAssociationMixinOptions) => Promise<TModel>;

/**
 * The options for the getAssociation mixin of the hasOne association.
 * @see HasOneGetAssociationMixin
 */
export interface HasOneGetAssociationMixinOptions extends FindOptions<any> {
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | string[] | boolean;
}
