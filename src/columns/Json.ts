import { DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

interface JsonOptions<T extends object | null> extends BaseColumnOptions<T> {}

/**
 * JSON Data Types for mysql, sqlite and postgres
 *
 * @since mysql 5.7.8
 * @since sqlite 3.9.0
 * @since postgres 9.4.0
 */
export class Json<Type extends object | null = object | null> extends AdvancedColumn<
  JsonOptions<Type>
> {
  declare readonly primaryKey: () => Json<NonNullable<Type>>;

  declare readonly notNull: () => Json<NonNullable<Type>>;

  declare readonly default: (value: NonNullable<Type>) => Json<NonNullable<Type>>;

  protected getType() {
    return DataTypes.JSON;
  }
}
