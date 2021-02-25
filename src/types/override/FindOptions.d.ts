import { Filterable, GroupOption, IndexHintable, LOCK, Paranoid, WhereOptions } from 'sequelize';
import { Includeable } from './Includeable';
import { Model } from './Model';
import { ModelStatic } from './ModelStatic';
import { Order } from './Order';
import { Projectable } from './Projectable';
import { QueryOptions } from './QueryOptions';

/**
 * Options that are passed to any model creating a SELECT query
 *
 * A hash of options to describe the scope of the search
 */
export interface FindOptions<TAttributes = any>
  extends QueryOptions, Filterable<TAttributes>, Projectable<TAttributes>, Paranoid, IndexHintable
{
  /**
   * A list of associations to eagerly load using a left join (a single association is also supported). Supported is either
   * `{ include: Model1 }`, `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   */
  include?: Includeable | Includeable[];

  /**
   * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   */
  order?: Order;

  /**
   * GROUP BY in sql
   */
  group?: GroupOption;

  /**
   * Limit the results
   */
  limit?: number;

  /**
   * Skip the results;
   */
  offset?: number;

  /**
   * Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE.
   * Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model
   * locks with joins. See [transaction.LOCK for an example](transaction#lock)
   */
  lock?:
  | LOCK
  | { level: LOCK; of: ModelStatic<Model> }
  | boolean;
  /**
   * Skip locked rows. Only supported in Postgres.
   */
  skipLocked?: boolean;

  /**
   * Return raw result. See sequelize.query for more information.
   */
  raw?: boolean;

  /**
   * Select group rows after groups and aggregates are computed.
   */
  having?: WhereOptions<any>;

  /**
   * Use sub queries (internal)
   */
  subQuery?: boolean;
}
