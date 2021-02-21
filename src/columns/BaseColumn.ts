import { ModelAttributeColumnOptions, AbstractDataTypeConstructor, AbstractDataType } from 'sequelize';

export interface BaseColumnOptions<Type> extends ModelAttributeColumnOptions {
  readonly __for__type_definition: Type;

  type: AbstractDataTypeConstructor | AbstractDataType;
}

export abstract class BaseColumn<T extends BaseColumnOptions<any> = BaseColumnOptions<any>> {
  protected readonly config: T = {
    type: this.getType(),
  } as T;

  public/*protected*/ collect(): ModelAttributeColumnOptions | false {
    return this.config;
  }

  public/*protected*/ methods(methods: { get?(): any; set?(value: any): any; }): void {
    this.config.get = methods.get;
    this.config.set = methods.set;
  }

  protected abstract getType(): AbstractDataTypeConstructor | AbstractDataType;
}
