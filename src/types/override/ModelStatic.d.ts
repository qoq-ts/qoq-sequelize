import { Model } from './model';

export type ModelStatic<M extends Model> = { new(): M };
