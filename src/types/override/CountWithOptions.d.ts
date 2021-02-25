import { GroupOption } from 'sequelize/types';
import { CountOptions } from './CountOptions';

/**
 * Options for Model.count when GROUP BY is used
 */
export interface CountWithOptions<TAttributes = any> extends CountOptions<TAttributes> {
  /**
   * GROUP BY in sql
   * Used in conjunction with `attributes`.
   * @see Projectable
   */
  group: GroupOption;
}
