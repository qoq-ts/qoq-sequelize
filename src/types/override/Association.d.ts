// import { Association } from 'sequelize';
import { Model } from './model';
import { ModelCtor } from './ModelCtor';

export abstract class Association<S extends Model = Model, T extends Model = Model> {
  public associationType: string;
  public source: ModelCtor<S>;
  public target: ModelCtor<T>;
  public isSelfAssociation: boolean;
  public isSingleAssociation: boolean;
  public isMultiAssociation: boolean;
  public as: string;
  public isAliased: boolean;
  public foreignKey: string;
  public identifier: string;
  public inspect(): string;
}
