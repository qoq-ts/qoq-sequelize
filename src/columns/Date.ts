import { DataTypes } from 'sequelize';
import { Literal, Fn } from 'sequelize/types/lib/utils';
import { Sequelize } from '../model/Sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface ColDateOptions<T extends Date | null> extends BaseColumnOptions<T> {}

export class ColDate<Type extends Date | null = Date | null> extends AdvancedColumn<ColDateOptions<Type>> {
  declare readonly primaryKey: () => ColDate<NonNullable<Type>>;

  declare readonly notNull: () => ColDate<NonNullable<Type>>;

  public defaultCurrent(): ColDate<NonNullable<Type>> {
    return this.default(Sequelize.literal('CURRENT_TIMESTAMP'));
  }

  public defaultCurrentWithUpdate(): ColDate<NonNullable<Type>> {
    return this.default(Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  }

  public default(value: Fn | Literal | 'now'): ColDate<NonNullable<Type>>;
  public default(value: string): ColDate<NonNullable<Type>>;
  public default(value: string | Fn | Literal | 'now'): ColDate<NonNullable<Type>> {
    // @ts-expect-error
    return super.default(value === 'now' ? DataTypes.NOW : value);
  }

  protected getType() {
    return DataTypes.DATEONLY;
  }
}
