import { BindOrReplacements, FieldMap, Logging, Poolable, RetryOptions, Transactionable } from 'sequelize/types';
import { Model } from './model';

/**
 * Interface for query options
 */
export interface QueryOptions extends Logging, Transactionable, Poolable {
  /**
   * If true, sequelize will not try to format the results of the query, or build an instance of a model from
   * the result
   */
  raw?: boolean;

  /**
   * The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   */
  type?: string;

  /**
   * If true, transforms objects with `.` separated property names into nested objects using
   * [dottie.js](https://github.com/mickhansen/dottie.js). For example { 'user.username': 'john' } becomes
   * { user: { username: 'john' }}. When `nest` is true, the query type is assumed to be `'SELECT'`,
   * unless otherwise specified
   *
   * @default false
   */
  nest?: boolean;

  /**
   * Sets the query type to `SELECT` and return a single row
   */
  plain?: boolean;

  /**
   * Either an object of named parameter replacements in the format `:param` or an array of unnamed
   * replacements to replace `?` in your SQL.
   */
  replacements?: BindOrReplacements;

  /**
   * Either an object of named parameter bindings in the format `$param` or an array of unnamed
   * values to bind to `$1`, `$2`, etc in your SQL.
   */
  bind?: BindOrReplacements;

  /**
   * A sequelize instance used to build the return instance
   */
  instance?: Model;

  /**
   * Map returned fields to model's fields if `options.model` or `options.instance` is present.
   * Mapping will occur before building the model instance.
   */
  mapToModel?: boolean;

  retry?: RetryOptions;

  /**
   * Map returned fields to arbitrary names for SELECT query type if `options.fieldMaps` is present.
   */
  fieldMap?: FieldMap;
}
