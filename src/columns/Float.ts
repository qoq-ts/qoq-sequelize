import { FloatDataType, FloatDataTypeConstructor, FloatDataTypeOptions, DataTypes } from 'sequelize';
import { AbstractNumberOptions, AbstractNumber } from './AbstractNumber';

export interface FloatOptions<T extends number | null> extends AbstractNumberOptions<T> {
  type: FloatDataTypeConstructor | FloatDataType;
}

export class Float<Type extends number | null = number | null> extends AbstractNumber<FloatOptions<Type>> {
  protected numberOptions: FloatDataTypeOptions = {};

  declare readonly primaryKey: () => Float<NonNullable<Type>>;

  declare readonly notNull: () => Float<NonNullable<Type>>;

  declare readonly default: (value: string) => Float<NonNullable<Type>>;

  public decimals(length: number): this {
    this.numberOptions.decimals = length;
    return this;
  }

  protected getType() {
    return DataTypes.FLOAT;
  }
}
