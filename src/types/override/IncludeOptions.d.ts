import { Filterable, Paranoid, WhereOptions } from 'sequelize';
import { Association } from './Association';
import { Includeable } from './Includeable';
import { IncludeThroughOptions } from './IncludeThroughOptions';
import { Model } from './Model';
import { Order } from './Order';
import { Projectable } from './Projectable';

/**
 * Complex include options
 */
export interface IncludeOptions<Attrs> extends Filterable<Attrs>, Projectable<Attrs>, Paranoid {
  /**
   * Mark the include as duplicating, will prevent a subquery from being used.
   */
  duplicating?: boolean;
  /**
   * The model you want to eagerly load
   */
  model?: typeof Model;

  /**
   * The alias of the relation, in case the model you want to eagerly load is aliassed. For `hasOne` /
   * `belongsTo`, this should be the singular name, and for `hasMany`, it should be the plural
   */
  as?: string;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: Association | string;

  /**
   * Custom `on` clause, overrides default.
   */
  on?: WhereOptions<Attrs>;

  /**
   * Note that this converts the eager load to an inner join,
   * unless you explicitly set `required: false`
   */
  where?: WhereOptions<Attrs>;

  /**
   * If true, converts to an inner join, which means that the parent model will only be loaded if it has any
   * matching children. True if `include.where` is set, false otherwise.
   */
  required?: boolean;

  /**
   * If true, converts to a right join if dialect support it. Ignored if `include.required` is true.
   */
  right?: boolean;

  /**
   * Limit include. Only available when setting `separate` to true.
   */
  limit?: number;

  /**
   * Run include in separate queries.
   */
  separate?: boolean;

  /**
   * Through Options
   */
  through?: IncludeThroughOptions<Attrs>;

  /**
   * Load further nested related models
   */
  include?: Includeable[];

  /**
   * Order include. Only available when setting `separate` to true.
   */
  order?: Order;

  /**
   * Use sub queries. This should only be used if you know for sure the query does not result in a cartesian product.
   */
  subQuery?: boolean;
}
