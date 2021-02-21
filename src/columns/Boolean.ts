import { DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface BooleanOptions<T extends boolean | null> extends BaseColumnOptions<T> {}

export class Boolean<Type extends boolean | null = boolean | null> extends AdvancedColumn<BooleanOptions<Type>> {
  public primaryKey(): Boolean<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Boolean<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: boolean): Boolean<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.BOOLEAN;
  }
}
