import { InstanceDestroyOptions } from 'sequelize/types';

/**
 * The removeAssociations mixin applied to models with belongsToMany.
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
 *  // addRole...
 *  // createRole...
 *  // removeRole...
 *  removeRoles: Sequelize.BelongsToManyRemoveAssociationsMixin<RoleInstance, RoleId>;
 *  // hasRole...
 *  // hasRoles...
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html
 * @see Instance
 */
export type BelongsToManyRemoveAssociationsMixin<TModel, TModelPrimaryKey> = (
  oldAssociateds?: (TModel | TModelPrimaryKey)[],
  options?: BelongsToManyRemoveAssociationsMixinOptions,
) => Promise<void>;

/**
 * The options for the removeAssociations mixin of the belongsToMany association.
 * @see BelongsToManyRemoveAssociationsMixin
 */
export interface BelongsToManyRemoveAssociationsMixinOptions
  extends InstanceDestroyOptions,
    InstanceDestroyOptions {}
