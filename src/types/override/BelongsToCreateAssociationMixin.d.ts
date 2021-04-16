import { RealModel } from '../custom/TransformModel';
import { BelongsToSetAssociationMixinOptions } from './BelongsToSetAssociationMixin';
import { CreateOptions } from './CreateOptions';
import { Model } from './Model';

/**
 * The createAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsTo(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *  // getRole...
 *  // setRole...
 *  createRole: Sequelize.BelongsToCreateAssociationMixin<RoleAttributes>;
 * }
 * ```
 *
 * @see https://sequelize.org/master/class/lib/associations/belongs-to.js~BelongsTo.html
 * @see Instance
 */
export type BelongsToCreateAssociationMixin<TModel extends Model> = (
  values?: { [attribute: string]: unknown },
  options?: BelongsToCreateAssociationMixinOptions
) => Promise<RealModel<TModel>>;

/**
 * The options for the createAssociation mixin of the belongsTo association.
 * @see BelongsToCreateAssociationMixin
 */
export interface BelongsToCreateAssociationMixinOptions
  extends CreateOptions<any>, BelongsToSetAssociationMixinOptions {}
