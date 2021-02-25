import { Sequelize } from '../../model/Sequelize';
import { Model } from './Model';
import { ModelOptions } from './ModelOptions';

/**
 * Options passed to [[Model.init]]
 */
export interface InitOptions<M extends Model = Model> extends ModelOptions<M> {
  /**
   * The sequelize connection. Required ATM.
   */
  sequelize: Sequelize;
}
