import { DataTypes } from 'sequelize';
import { AbstractString, AbstractStringOptions } from './AbstractString';

interface VarcharOptions<T extends string | null> extends AbstractStringOptions<T> {}

export class Varchar<Type extends string | null = string | null> extends AbstractString<VarcharOptions<Type>> {
  public primaryKey(): Varchar<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Varchar<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): Varchar<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.STRING;
  }
}
