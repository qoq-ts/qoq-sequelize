import { DataTypes } from 'sequelize';
import { AbstractString, AbstractStringOptions } from './AbstractString';

interface CharOptions<T extends string | null> extends AbstractStringOptions<T> {}

export class Char<Type extends string | null = string | null> extends AbstractString<CharOptions<Type>> {
  declare readonly primaryKey: () => Char<NonNullable<Type>>;

  declare readonly notNull: () => Char<NonNullable<Type>>;

  declare readonly default: (value: string) => Char<NonNullable<Type>>;

  protected getType() {
    return DataTypes.CHAR;
  }
}
