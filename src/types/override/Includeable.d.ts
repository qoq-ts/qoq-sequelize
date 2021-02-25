import { Association } from './Association';
import { IncludeOptions } from './IncludeOptions';
import { Model } from './model';

/**
 * Options for eager-loading associated models, also allowing for all associations to be loaded at once
 */
export type Includeable<Attrs = any> = typeof Model | Association | IncludeOptions<Attrs> | { all: true, nested?: true } | string;
