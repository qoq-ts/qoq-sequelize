import { CountOptions } from './CountOptions';
import { FindOptions } from './FindOptions';

export interface FindAndCountOptions<TAttributes = any> extends CountOptions<TAttributes>, FindOptions<TAttributes> { }
