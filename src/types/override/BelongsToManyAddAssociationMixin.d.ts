import { InstanceDestroyOptions, InstanceUpdateOptions } from 'sequelize';
import { BulkCreateOptions } from './BulkCreateOptions';
import { FindOptions } from './FindOptions';
import { JoinTableAttributes } from './JoinTableAttributes';

/**
 * The addAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRoles...
 *  // setRoles...
 *  // addRoles...
 *  addRole: Sequelize.BelongsToManyAddAssociationMixin<RoleInstance, RoleId, UserRoleAttributes>;
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
export type BelongsToManyAddAssociationMixin<TModel, TModelPrimaryKey> = (
  newAssociation?: TModel | TModelPrimaryKey,
  options?: BelongsToManyAddAssociationMixinOptions,
) => Promise<void>;

/**
 * The options for the addAssociation mixin of the belongsToMany association.
 * @see BelongsToManyAddAssociationMixin
 */
export interface BelongsToManyAddAssociationMixinOptions
  extends FindOptions<any>,
    BulkCreateOptions<any>,
    InstanceUpdateOptions<any>,
    InstanceDestroyOptions {
  through?: JoinTableAttributes;
}
