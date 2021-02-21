import { ModelAttributeColumnOptions, StringDataType, StringDataTypeConstructor, StringDataTypeOptions } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface AbstractStringOptions<T extends string | null> extends BaseColumnOptions<T> {
  type: StringDataTypeConstructor | StringDataType;
}

export abstract class AbstractString<T extends AbstractStringOptions<any>> extends AdvancedColumn<T> {
  protected stringOptions: StringDataTypeOptions = {};

  protected isBinary = false;

  public length(length: number): this {
    this.stringOptions.length = length;
    return this;
  }

  public binary(): this {
    this.isBinary = true;
    return this;
  }

  public/*protected*/ collect(): ModelAttributeColumnOptions {
    this.config.type = (this.config.type as StringDataTypeConstructor)(this.stringOptions);

    if (this.isBinary) {
      this.config.type = this.config.type.BINARY;
    }

    return super.collect();
  }
}
