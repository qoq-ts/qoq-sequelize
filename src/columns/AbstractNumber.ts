import { NumberDataType, NumberDataTypeConstructor, NumberDataTypeOptions, ModelAttributeColumnOptions } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface AbstractNumberOptions<T extends number | null> extends BaseColumnOptions<T> {
  type: NumberDataTypeConstructor | NumberDataType;
}

export abstract class AbstractNumber<T extends AbstractNumberOptions<any>> extends AdvancedColumn<T> {
  protected numberOptions: NumberDataTypeOptions = {};

  protected isUnsigned = false;
  protected isZeroFill = false;

  public autoIncrement(postgres__asIdentity?: boolean): this {
    this.config.autoIncrement = true;

    if (postgres__asIdentity !== undefined) {
      this.config.autoIncrementIdentity = postgres__asIdentity;
    }
    return this;
  }

  public unsigned(): this {
    this.isUnsigned = true;
    return this;
  }

  public zeroFill(): this {
    this.isZeroFill = true;
    return this;
  }

  public length(length: number): this {
    this.numberOptions.length = length;
    return this;
  }

  public/*protected*/ collect(): ModelAttributeColumnOptions {
    this.config.type = (this.config.type as NumberDataTypeConstructor)(this.numberOptions);

    if (this.isUnsigned) {
      this.config.type = this.config.type.UNSIGNED;
    }

    if (this.isZeroFill) {
      this.config.type = this.config.type.ZEROFILL;
    }

    return super.collect();
  }
}
