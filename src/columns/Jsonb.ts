import { DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

interface JsonbOptions<T extends object | null> extends BaseColumnOptions<T> {}

/**
 * JSON Data Types for postgress
 */
export class Jsonb<Type extends object | null = object | null> extends AdvancedColumn<JsonbOptions<Type>> {
  declare readonly primaryKey: () => Jsonb<NonNullable<Type>>;

  declare readonly notNull: () => Jsonb<NonNullable<Type>>;

  declare readonly default: (value: NonNullable<Type>) => Jsonb<NonNullable<Type>>;

  protected getType() {
    return DataTypes.JSONB;
  }
}
