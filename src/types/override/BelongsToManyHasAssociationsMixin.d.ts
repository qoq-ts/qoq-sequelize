import { BelongsToManyGetAssociationsMixinOptions } from './BelongsToManyGetAssociationsMixin';
import { Model } from './model';

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
 *  // removeRoles
 *  // hasRole...
 *  hasRoles: Sequelize.BelongsToManyHasAssociationsMixin<RoleInstance, RoleId>;
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html
 * @see Instance
 */
export type BelongsToManyHasAssociationsMixin<M extends Model, TModelPrimaryKey> = (
  targets: (Model | TModelPrimaryKey)[],
  options?: BelongsToManyHasAssociationsMixinOptions<M['_attributes']>
) => Promise<boolean>;

/**
 * The options for the hasAssociations mixin of the belongsToMany association.
 * @see BelongsToManyHasAssociationsMixin
 */
export interface BelongsToManyHasAssociationsMixinOptions<Attrs> extends BelongsToManyGetAssociationsMixinOptions<Attrs> {}
