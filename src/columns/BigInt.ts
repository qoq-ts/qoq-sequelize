import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface BigIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class BigInt<Type extends number | null = number | null> extends AbstractNumber<BigIntOptions<Type>> {
  declare readonly primaryKey: () => BigInt<NonNullable<Type>>;

  declare readonly notNull: () => BigInt<NonNullable<Type>>;

  declare readonly default: (value: number) => BigInt<NonNullable<Type>>;

  protected getType() {
    return DataTypes.BIGINT;
  }
}
