import { Includeable } from './Includeable';

/**
 * Options for Model.build method
 */
export interface BuildOptions {
  /**
   * If set to true, values will ignore field and virtual setters.
   */
  raw?: boolean;

  /**
   * Is this record new
   */
  isNewRecord?: boolean;

  /**
   * An array of include options. A single option is also supported - Used to build prefetched/included model instances. See `set`
   *
   * TODO: See set
   */
  include?: Includeable | Includeable[];
}
