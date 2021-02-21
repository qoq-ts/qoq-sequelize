import { DecimalDataType, DecimalDataTypeConstructor, DecimalDataTypeOptions, DataTypes } from 'sequelize';
import { AbstractNumberOptions, AbstractNumber } from './AbstractNumber';

export interface DecimalOptions<T extends number | null> extends AbstractNumberOptions<T> {
  type: DecimalDataTypeConstructor | DecimalDataType;
}

export class Decimal<Type extends number | null = number | null> extends AbstractNumber<DecimalOptions<Type>> {
  protected numberOptions: DecimalDataTypeOptions = {};

  public primaryKey(): Decimal<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Decimal<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: number): Decimal<NonNullable<Type>> {
    return super.default(value);
  }

  public scale(length: number): this {
    this.numberOptions.scale = length;
    return this;
  }

  public precision(length: number): this {
    this.numberOptions.precision = length;
    return this;
  }

  /**
   * @deprecated Decimal doesn't support length
   */
  public length(DO_NOT_USE_THIS_METHOD: never): this {
    return super.length(DO_NOT_USE_THIS_METHOD);
  }

  protected getType() {
    return DataTypes.DECIMAL;
  }
}
