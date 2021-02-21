import { RealDataType, RealDataTypeConstructor, RealDataTypeOptions, DataTypes } from 'sequelize';
import { AbstractNumberOptions, AbstractNumber } from './AbstractNumber';

export interface RealOptions<T extends number | null> extends AbstractNumberOptions<T> {
  type: RealDataTypeConstructor | RealDataType;
}

// PostgreSQL only
export class Real<Type extends number | null = number | null> extends AbstractNumber<RealOptions<Type>> {
  protected numberOptions: RealDataTypeOptions = {};

  public primaryKey(): Real<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Real<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): Real<NonNullable<Type>> {
    return super.default(value);
  }

  public decimals(length: number): this {
    this.numberOptions.decimals = length;
    return this;
  }

  protected getType() {
    return DataTypes.REAL;
  }
}
