import { MultiAssociationAccessors } from 'sequelize';
import { Association } from './Association';
import { BelongsToManyOptions } from './BelongsToManyOptions';
import { Model } from './model';
import { ModelCtor } from './ModelCtor';

export class BelongsToMany<S extends Model = Model, T extends Model = Model> extends Association<S, T> {
  private readonly _BelongsToMany_: 't-belongs-to-many';
  public otherKey: string;
  public sourceKey: string;
  public targetKey: string;
  public accessors: MultiAssociationAccessors;
  constructor(source: ModelCtor<S>, target: ModelCtor<T>, options: BelongsToManyOptions<S, T, Model>);
}
