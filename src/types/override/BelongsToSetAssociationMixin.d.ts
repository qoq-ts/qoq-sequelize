import { SaveOptions } from 'sequelize/types';

/**
 * The setAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsTo(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRole...
 *  setRole: Sequelize.BelongsToSetAssociationMixin<RoleInstance, RoleId>;
 *  // createRole...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to.js~BelongsTo.html
 * @see Instance
 */
export type BelongsToSetAssociationMixin<TModel, TPrimaryKey> = (
  newAssociation?: TModel | TPrimaryKey,
  options?: BelongsToSetAssociationMixinOptions,
) => Promise<void>;

/**
 * The options for the setAssociation mixin of the belongsTo association.
 * @see BelongsToSetAssociationMixin
 */
export interface BelongsToSetAssociationMixinOptions extends SaveOptions<any> {
  /**
   * Skip saving this after setting the foreign key if false.
   */
  save?: boolean;
}
