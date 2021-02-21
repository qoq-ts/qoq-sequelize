import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface SmallIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class SmallInt<Type extends number | null = number | null> extends AbstractNumber<SmallIntOptions<Type>> {
  public primaryKey(): SmallInt<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): SmallInt<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: number): SmallInt<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.SMALLINT;
  }
}
