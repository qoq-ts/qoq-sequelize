import { SingleAssociationAccessors } from 'sequelize';
import { Association } from './Association';
import { BelongsToOptions } from './BelongsToOptions';
import { Model } from './model';
import { ModelCtor } from './ModelCtor';

export class BelongsTo<S extends Model = Model, T extends Model = Model> extends Association<S, T> {
  private readonly _BelongsTo_: 't-belongs-to';
  public accessors: SingleAssociationAccessors;
  constructor(source: ModelCtor<S>, target: ModelCtor<T>, options: BelongsToOptions<S, T>);
}
