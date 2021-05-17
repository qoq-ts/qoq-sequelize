import { Model } from './Model';

export type ModelType<TModelAttributes = any, TCreationAttributes = TModelAttributes> =
  new () => Model<TModelAttributes, TCreationAttributes>;
