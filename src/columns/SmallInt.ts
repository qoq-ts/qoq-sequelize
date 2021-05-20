import sequelize from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface SmallIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class SmallInt<Type extends number | null = number | null> extends AbstractNumber<
  SmallIntOptions<Type>
> {
  declare readonly primaryKey: () => SmallInt<NonNullable<Type>>;

  declare readonly notNull: () => SmallInt<NonNullable<Type>>;

  declare readonly default: (value: number) => SmallInt<NonNullable<Type>>;

  protected getType() {
    return sequelize.DataTypes.SMALLINT;
  }
}
