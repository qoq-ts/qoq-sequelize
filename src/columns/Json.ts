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
export class Json<Type extends object | null = object | null> extends AdvancedColumn<JsonOptions<Type>> {
  public primaryKey(): Json<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Json<NonNullable<Type>> {
    this.config.allowNull = false;
    // @ts-expect-error
    return this;
  }

  public default(value: NonNullable<Type>): Json<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.JSON;
  }
}
