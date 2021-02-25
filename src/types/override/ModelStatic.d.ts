import { Model } from './Model';

export type ModelStatic<M extends Model> = { new(): M };
