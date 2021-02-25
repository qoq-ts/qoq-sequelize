import { SingleAssociationAccessors } from 'sequelize/types';
import { Association } from './Association';
import { HasOneOptions } from './HasOneOptions';
import { Model } from './Model';
import { ModelCtor } from './ModelCtor';

export class HasOne<S extends Model = Model, T extends Model = Model> extends Association<S, T> {
  private readonly _HasOne_: 't-has-one';
  public accessors: SingleAssociationAccessors;
  constructor(source: ModelCtor<S>, target: ModelCtor<T>, options: HasOneOptions<S, T>);
}
