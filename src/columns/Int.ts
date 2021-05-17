import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface IntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class Int<Type extends number | null = number | null> extends AbstractNumber<
  IntOptions<Type>
> {
  declare readonly primaryKey: () => Int<NonNullable<Type>>;

  declare readonly notNull: () => Int<NonNullable<Type>>;

  declare readonly default: (value: number) => Int<NonNullable<Type>>;

  protected getType() {
    return DataTypes.INTEGER;
  }
}
