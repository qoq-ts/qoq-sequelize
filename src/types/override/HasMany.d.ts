import { MultiAssociationAccessors } from 'sequelize';
import { Association } from './Association';
import { HasManyOptions } from './HasManyOptions';
import { Model } from './model';
import { ModelCtor } from './ModelCtor';

export class HasMany<S extends Model = Model, T extends Model = Model> extends Association<S, T> {
  private readonly _HasMany_: 't-has-many';

  public accessors: MultiAssociationAccessors;
  constructor(source: ModelCtor<S>, target: ModelCtor<T>, options: HasManyOptions<S, T>);
}
