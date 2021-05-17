import { DataType, Filterable, Paranoid } from 'sequelize';
import { QueryOptions } from './QueryOptions';

/**
 * Options used for Model.aggregate
 */
export interface AggregateOptions<T extends DataType | unknown, TAttributes = any>
  extends QueryOptions,
    Filterable<TAttributes>,
    Paranoid {
  /**
   * The type of the result. If `field` is a field in this Model, the default will be the type of that field,
   * otherwise defaults to float.
   */
  dataType?: string | T;

  /**
   * Applies DISTINCT to the field being aggregated over
   */
  distinct?: boolean;
}
