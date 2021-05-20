import sequelize, { RealDataType, RealDataTypeConstructor, RealDataTypeOptions } from 'sequelize';
import { AbstractNumberOptions, AbstractNumber } from './AbstractNumber';

export interface RealOptions<T extends number | null> extends AbstractNumberOptions<T> {
  type: RealDataTypeConstructor | RealDataType;
}

// PostgreSQL only
export class Real<Type extends number | null = number | null> extends AbstractNumber<
  RealOptions<Type>
> {
  protected numberOptions: RealDataTypeOptions = {};

  declare readonly primaryKey: () => Real<NonNullable<Type>>;

  declare readonly notNull: () => Real<NonNullable<Type>>;

  declare readonly default: (value: string) => Real<NonNullable<Type>>;

  public decimals(length: number): this {
    this.numberOptions.decimals = length;
    return this;
  }

  protected getType() {
    return sequelize.DataTypes.REAL;
  }
}
