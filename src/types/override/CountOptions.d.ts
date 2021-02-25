import { Filterable, GroupOption, Logging, Paranoid, Poolable, Transactionable } from 'sequelize';
import { Includeable } from './Includeable';
import { Projectable } from './Projectable';

/**
 * Options for Model.count method
 */
export interface CountOptions<TAttributes = any>
  extends Logging, Transactionable, Filterable<TAttributes>, Projectable<TAttributes>, Paranoid, Poolable
{
  /**
   * Include options. See `find` for details
   */
  include?: Includeable | Includeable[];

  /**
   * Apply COUNT(DISTINCT(col))
   */
  distinct?: boolean;

  /**
   * GROUP BY in sql
   * Used in conjunction with `attributes`.
   * @see Projectable
   */
  group?: GroupOption;

  /**
   * The column to aggregate on.
   */
  col?: string;
}
