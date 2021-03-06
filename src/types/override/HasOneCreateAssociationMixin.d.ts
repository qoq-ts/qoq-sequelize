import { RealModel } from '../custom/TransformModel';
import { CreateOptions } from './CreateOptions';
import { HasOneSetAssociationMixinOptions } from './HasOneSetAssociationMixin';
import { Model } from './Model';

/**
 * The createAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasOne(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRole...
 *  // setRole...
 *  createRole: Sequelize.HasOneCreateAssociationMixin<RoleAttributes>;
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/has-one.js~HasOne.html
 * @see Instance
 */
export type HasOneCreateAssociationMixin<TModel extends Model> = (
  values?: { [attribute: string]: unknown },
  options?: HasOneCreateAssociationMixinOptions,
) => Promise<RealModel<TModel>>;

/**
 * The options for the createAssociation mixin of the hasOne association.
 * @see HasOneCreateAssociationMixin
 */
export interface HasOneCreateAssociationMixinOptions
  extends HasOneSetAssociationMixinOptions,
    CreateOptions<any> {}
