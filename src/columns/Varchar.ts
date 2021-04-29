import { DataTypes } from 'sequelize';
import { AbstractString, AbstractStringOptions } from './AbstractString';

interface VarcharOptions<T extends string | null> extends AbstractStringOptions<T> {}

export class Varchar<Type extends string | null = string | null> extends AbstractString<VarcharOptions<Type>> {
  declare readonly primaryKey: () => Varchar<NonNullable<Type>>;

  declare readonly notNull: () => Varchar<NonNullable<Type>>;

  declare readonly default: (value: string) => Varchar<NonNullable<Type>>;

  protected getType() {
    return DataTypes.STRING;
  }
}
