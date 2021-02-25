import { FindOptions } from './FindOptions';

export interface NonNullFindOptions<TAttributes = any> extends FindOptions<TAttributes> {
  /**
   * Throw if nothing was found.
   */
  rejectOnEmpty: true | Error;
}
