import { ModelAttributeColumnOptions, TextDataTypeConstructor, TextDataType, TextDataTypeOptions, DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface AbstractTextOptions<T extends string | null> extends BaseColumnOptions<T> {
  type: TextDataTypeConstructor | TextDataType;
}

export abstract class AbstractText<T extends AbstractTextOptions<any>> extends AdvancedColumn<T> {
  protected readonly stringOptions?: TextDataTypeOptions;

  constructor(options?: TextDataTypeOptions) {
    super();
    this.stringOptions = options;
  }

  public/*protected*/ collect(): ModelAttributeColumnOptions {
    this.config.type = (this.config.type as TextDataTypeConstructor)(this.stringOptions);
    return super.collect();
  }

  protected getType() {
    return DataTypes.TEXT;
  }
}
