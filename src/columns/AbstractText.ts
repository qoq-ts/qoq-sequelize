import sequelize, {
  ModelAttributeColumnOptions,
  TextDataTypeConstructor,
  TextDataType,
  TextDataTypeOptions,
} from 'sequelize';
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

  public /*protected*/ collect(): ModelAttributeColumnOptions {
    const config = super.collect();
    config.type = (config.type as TextDataTypeConstructor)(this.stringOptions);
    return config;
  }

  protected getType() {
    return sequelize.DataTypes.TEXT;
  }
}
