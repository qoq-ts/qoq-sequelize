import { Association } from './Association';
import { IncludeOptions } from './IncludeOptions';
import { ModelType } from './ModelType';

/**
 * ##############
 * Omit: string
 * ###############
 */

/**
 * Options for eager-loading associated models, also allowing for all associations to be loaded at once
 */
export type Includeable<Attrs = any> = ModelType | Association | IncludeOptions<Attrs> | { all: true, nested?: true } /*| string*/;
