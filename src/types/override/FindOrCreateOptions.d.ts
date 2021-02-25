import { FindOptions } from './FindOptions';

/**
 * Options for Model.findOrCreate method
 */
export interface FindOrCreateOptions<TAttributes = any, TCreationAttributes = TAttributes>
  extends FindOptions<TAttributes>
{
  /**
   * The fields to insert / update. Defaults to all fields
   */
  fields?: (keyof TAttributes)[];
  /**
   * Default values to use if building a new instance
   */
  defaults?: TCreationAttributes;
}
