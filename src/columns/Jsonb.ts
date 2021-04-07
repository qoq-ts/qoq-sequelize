import { DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

interface JsonbOptions<T extends object | null> extends BaseColumnOptions<T> {}

/**
 * JSON Data Types for postgress
 */
export class Jsonb<Type extends object | null = object | null> extends AdvancedColumn<JsonbOptions<Type>> {
  public primaryKey(): Jsonb<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Jsonb<NonNullable<Type>> {
    this.config.allowNull = false;
    // @ts-expect-error
    return this;
  }

  public default(value: NonNullable<Type>): Jsonb<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.JSONB;
  }
}
