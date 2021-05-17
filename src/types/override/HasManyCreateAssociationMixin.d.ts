import { RealModel } from '../custom/TransformModel';
import { CreateOptions } from './CreateOptions';
import { Model } from './Model';

/**
 * The createAssociation mixin applied to models with hasMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasMany(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRoles...
 *  // setRoles...
 *  // addRoles...
 *  // addRole...
 *  createRole: Sequelize.HasManyCreateAssociationMixin<RoleAttributes>;
 *  // removeRole...
 *  // removeRoles...
 *  // hasRole...
 *  // hasRoles...
 *  // countRoles...
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-many.js~HasMany.html
 * @see Instance
 */
export type HasManyCreateAssociationMixin<TModel extends Model> = (
  values?: { [attribute: string]: unknown },
  options?: HasManyCreateAssociationMixinOptions,
) => Promise<RealModel<TModel>>;

/**
 * The options for the createAssociation mixin of the hasMany association.
 * @see HasManyCreateAssociationMixin
 */
export interface HasManyCreateAssociationMixinOptions extends CreateOptions<any> {}
