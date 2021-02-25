import { BelongsToManyGetAssociationsMixinOptions } from './BelongsToManyGetAssociationsMixin';
import { Model } from './model';

/**
 * The hasAssociation mixin applied to models with belongsToMany.
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
 *  // removeRoles...
 *  hasRole: Sequelize.BelongsToManyHasAssociationMixin<RoleInstance, RoleId>;
 *  // hasRoles...
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html
 * @see Instance
 */
export type BelongsToManyHasAssociationMixin<M extends Model, TModelPrimaryKey> = (
  target: Model | TModelPrimaryKey,
  options?: BelongsToManyHasAssociationMixinOptions<M['_attributes']>
) => Promise<boolean>;

/**
 * The options for the hasAssociation mixin of the belongsToMany association.
 * @see BelongsToManyHasAssociationMixin
 */
export interface BelongsToManyHasAssociationMixinOptions<Attrs> extends BelongsToManyGetAssociationsMixinOptions<Attrs> {}
