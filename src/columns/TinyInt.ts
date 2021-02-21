import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface TinyIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class TinyInt<Type extends number | null = number | null> extends AbstractNumber<TinyIntOptions<Type>> {
  public primaryKey(): TinyInt<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): TinyInt<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: number): TinyInt<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.TINYINT;
  }
}
