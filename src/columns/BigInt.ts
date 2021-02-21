import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface BigIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class BigInt<Type extends number | null = number | null> extends AbstractNumber<BigIntOptions<Type>> {
  public primaryKey(): BigInt<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): BigInt<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: number): BigInt<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.BIGINT;
  }
}
