import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface TinyIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class TinyInt<Type extends number | null = number | null> extends AbstractNumber<
  TinyIntOptions<Type>
> {
  declare readonly primaryKey: () => TinyInt<NonNullable<Type>>;

  declare readonly notNull: () => TinyInt<NonNullable<Type>>;

  declare readonly default: (value: number) => TinyInt<NonNullable<Type>>;

  protected getType() {
    return DataTypes.TINYINT;
  }
}
