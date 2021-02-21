import { DataTypes } from 'sequelize';
import { AbstractString, AbstractStringOptions } from './AbstractString';

interface CharOptions<T extends string | null> extends AbstractStringOptions<T> {}

export class Char<Type extends string | null = string | null> extends AbstractString<CharOptions<Type>> {
  public primaryKey(): Char<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Char<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): Char<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.CHAR;
  }
}
