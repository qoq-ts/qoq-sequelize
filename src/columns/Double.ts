import { DoubleDataType, DoubleDataTypeConstructor, DoubleDataTypeOptions, DataTypes } from 'sequelize';
import { AbstractNumberOptions, AbstractNumber } from './AbstractNumber';

export interface DoubleOptions<T extends number | null> extends AbstractNumberOptions<T> {
  type: DoubleDataTypeConstructor | DoubleDataType;
}

export class Double<Type extends number | null = number | null> extends AbstractNumber<DoubleOptions<Type>> {
  protected numberOptions: DoubleDataTypeOptions = {};

  public primaryKey(): Double<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Double<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): Double<NonNullable<Type>> {
    return super.default(value);
  }

  public decimals(length: number): this {
    this.numberOptions.decimals = length;
    return this;
  }

  protected getType() {
    return DataTypes.DOUBLE;
  }
}
