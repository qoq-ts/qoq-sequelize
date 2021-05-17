import { InstanceDestroyOptions, InstanceUpdateOptions } from 'sequelize/types';
import { BulkCreateOptions } from './BulkCreateOptions';
import { FindOptions } from './FindOptions';
import { JoinTableAttributes } from './JoinTableAttributes';

/**
 * The addAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRoles...
 *  // setRoles...
 *  addRoles: Sequelize.BelongsToManyAddAssociationsMixin<RoleInstance, RoleId, UserRoleAttributes>;
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
export type BelongsToManyAddAssociationsMixin<TModel, TModelPrimaryKey> = (
  newAssociations?: (TModel | TModelPrimaryKey)[],
  options?: BelongsToManyAddAssociationsMixinOptions,
) => Promise<void>;

/**
 * The options for the addAssociations mixin of the belongsToMany association.
 * @see BelongsToManyAddAssociationsMixin
 */
export interface BelongsToManyAddAssociationsMixinOptions
  extends FindOptions<any>,
    BulkCreateOptions<any>,
    InstanceUpdateOptions<any>,
    InstanceDestroyOptions {
  through?: JoinTableAttributes;
}
