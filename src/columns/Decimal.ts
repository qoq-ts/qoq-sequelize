import sequelize, {
  DecimalDataType,
  DecimalDataTypeConstructor,
  DecimalDataTypeOptions,
} from 'sequelize';
import { AbstractNumberOptions, AbstractNumber } from './AbstractNumber';

export interface DecimalOptions<T extends number | null> extends AbstractNumberOptions<T> {
  type: DecimalDataTypeConstructor | DecimalDataType;
}

export class Decimal<Type extends number | null = number | null> extends AbstractNumber<
  DecimalOptions<Type>
> {
  protected numberOptions: DecimalDataTypeOptions = {};

  declare readonly primaryKey: () => Decimal<NonNullable<Type>>;

  declare readonly notNull: () => Decimal<NonNullable<Type>>;

  declare readonly default: (value: number) => Decimal<NonNullable<Type>>;

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
    return sequelize.DataTypes.DECIMAL;
  }
}
