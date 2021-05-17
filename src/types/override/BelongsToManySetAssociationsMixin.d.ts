import { InstanceDestroyOptions, InstanceUpdateOptions } from 'sequelize/types';
import { BulkCreateOptions } from './BulkCreateOptions';
import { FindOptions } from './FindOptions';
import { JoinTableAttributes } from './JoinTableAttributes';

/**
 * The setAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRoles...
 *  setRoles: Sequelize.BelongsToManySetAssociationsMixin<RoleInstance, RoleId, UserRoleAttributes>;
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
 * @see https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html
 * @see Instance
 */
export type BelongsToManySetAssociationsMixin<TModel, TModelPrimaryKey> = (
  newAssociations?: (TModel | TModelPrimaryKey)[],
  options?: BelongsToManySetAssociationsMixinOptions,
) => Promise<void>;

/**
 * The options for the setAssociations mixin of the belongsToMany association.
 * @see BelongsToManySetAssociationsMixin
 */
export interface BelongsToManySetAssociationsMixinOptions
  extends FindOptions<any>,
    BulkCreateOptions<any>,
    InstanceUpdateOptions<any>,
    InstanceDestroyOptions {
  through?: JoinTableAttributes;
}
