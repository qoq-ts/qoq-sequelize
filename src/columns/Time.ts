import { DataTypes } from 'sequelize';
import { Literal, Fn } from 'sequelize/types/lib/utils';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';
import { Sequelize } from '..';

export interface TimeOptions<T extends Date | null> extends BaseColumnOptions<T> {}

export class Time<Type extends Date | null = Date | null> extends AdvancedColumn<TimeOptions<Type>> {
  public primaryKey(): Time<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Time<NonNullable<Type>> {
    return super.notNull();
  }

  public defaultCurrent(): Time<NonNullable<Type>> {
    return this.default(Sequelize.literal('CURRENT_TIMESTAMP'));
  }

  public defaultCurrentWithUpdate(): Time<NonNullable<Type>> {
    return this.default(Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  }

  public default(value: Fn | Literal | 'now'): Time<NonNullable<Type>>;
  public default(value: string): Time<NonNullable<Type>>;
  public default(value: string | Fn | Literal | 'now'): Time<NonNullable<Type>> {
    return super.default(value === 'now' ? DataTypes.NOW : value);
  }

  protected getType() {
    return DataTypes.TIME;
  }
}
