import { SaveOptions } from 'sequelize/types';
import { HasOneGetAssociationMixinOptions } from './HasOneGetAssociationMixin';

/**
 * The setAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasOne(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRole...
 *  setRole: Sequelize.HasOneSetAssociationMixin<RoleInstance, RoleId>;
 *  // createRole...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-one.js~HasOne.html
 * @see Instance
 */
export type HasOneSetAssociationMixin<TModel, TModelPrimaryKey> = (
  newAssociation?: TModel | TModelPrimaryKey,
  options?: HasOneSetAssociationMixinOptions,
) => Promise<void>;

/**
 * The options for the setAssociation mixin of the hasOne association.
 * @see HasOneSetAssociationMixin
 */
export interface HasOneSetAssociationMixinOptions
  extends HasOneGetAssociationMixinOptions,
    SaveOptions<any> {
  /**
   * Skip saving this after setting the foreign key if false.
   */
  save?: boolean;
}
