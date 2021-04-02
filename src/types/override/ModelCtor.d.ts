import { Model } from './Model';

// Do not switch the order of `typeof Model` and `{ new(): M }`. For
// instances created by `sequelize.define` to typecheck well, `typeof Model`
// must come first for unknown reasons.
export type ModelCtor<M extends Model, Include = unknown> = { include: Include } & typeof Model & { new(): M };
