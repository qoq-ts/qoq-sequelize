import { FindOptions } from './FindOptions';

/**
 * The getAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsTo(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttrib>, UserAttrib {
 *  getRole: Sequelize.BelongsToGetAssociationMixin<RoleInstance>;
 *  // setRole...
 *  // createRole...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to.js~BelongsTo.html
 * @see Instance
 */
export type BelongsToGetAssociationMixin<TModel> = (options?: BelongsToGetAssociationMixinOptions) => Promise<TModel>;

/**
 * The options for the getAssociation mixin of the belongsTo association.
 * @see BelongsToGetAssociationMixin
 */
export interface BelongsToGetAssociationMixinOptions extends FindOptions<any> {
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | string[] | boolean;
}
