import { DataTypes, DateDataTypeConstructor, DateDataType, ModelAttributeColumnOptions } from 'sequelize';
import { Literal, Fn } from 'sequelize/types/lib/utils';
import { Sequelize } from '../model/Sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface DateTimeOptions<T extends Date | null> extends BaseColumnOptions<T> {
  type: DateDataTypeConstructor | DateDataType
}

// For mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
export class DateTime<Type extends Date | null = Date | null> extends AdvancedColumn<DateTimeOptions<Type>> {
  protected precision?: number | string;

  declare readonly primaryKey: () => DateTime<NonNullable<Type>>;

  declare readonly notNull: () => DateTime<NonNullable<Type>>;

  /**
   * inject sql `CURRENT_TIMESTAMP`
   */
  public defaultCurrent(): DateTime<NonNullable<Type>> {
    return this.default(Sequelize.literal('CURRENT_TIMESTAMP'));
  }

  /**
   * inject sql `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
   * This method is only available with mysql
   */
  public defaultCurrentWithUpdate(): DateTime<NonNullable<Type>> {
    return this.default(Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  }

  public default(value: Fn | Literal | 'now'): DateTime<NonNullable<Type>>;
  public default(value: string): DateTime<NonNullable<Type>>;
  public default(value: string | Fn | Literal | 'now'): DateTime<NonNullable<Type>> {
    // @ts-expect-error
    return super.default(value === 'now' ? DataTypes.NOW : value);
  }

  /**
   * @param {number} length digits of precision
   * @since mysql 5.6.4
   */
  public length(precision: number | string) {
    this.precision = precision;
  }

  public/*protected*/ collect(): ModelAttributeColumnOptions {
    const config = super.collect();

    if (this.precision) {
      config.type = (config.type as DateDataTypeConstructor)(this.precision);
    }

    return config;
  }

  protected getType() {
    return DataTypes.DATE;
  }
}
