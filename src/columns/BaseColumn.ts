import {
  ModelAttributeColumnOptions,
  AbstractDataTypeConstructor,
  AbstractDataType,
} from 'sequelize';

export interface BaseColumnOptions<Type> extends ModelAttributeColumnOptions {
  readonly __for__type_definition: Type;

  type: AbstractDataTypeConstructor | AbstractDataType;
}

export abstract class BaseColumn<T extends BaseColumnOptions<any> = BaseColumnOptions<any>> {
  protected readonly config: T = {
    type: this.getType(),
  } as T;

  public /*protected*/ collect(): ModelAttributeColumnOptions {
    return Object.assign({}, this.config);
  }

  protected abstract getType(): AbstractDataTypeConstructor | AbstractDataType;
}
