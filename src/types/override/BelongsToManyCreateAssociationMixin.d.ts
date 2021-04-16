import { RealModel } from '../custom/TransformModel';
import { CreateOptions } from './CreateOptions';
import { JoinTableAttributes } from './JoinTableAttributes';
import { Model } from './Model';

/**
 * The createAssociation mixin applied to models with belongsToMany.
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
 *  createRole: Sequelize.BelongsToManyCreateAssociationMixin<RoleAttributes, UserRoleAttributes>;
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
export type BelongsToManyCreateAssociationMixin<TModel extends Model> = (
  values?: { [attribute: string]: unknown },
  options?: BelongsToManyCreateAssociationMixinOptions
) => Promise<RealModel<TModel>>;

/**
 * The options for the createAssociation mixin of the belongsToMany association.
 * @see BelongsToManyCreateAssociationMixin
 */
export interface BelongsToManyCreateAssociationMixinOptions extends CreateOptions<any> {
  through?: JoinTableAttributes;
}
