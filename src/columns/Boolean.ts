import { DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface BooleanOptions<T extends boolean | null> extends BaseColumnOptions<T> {}

export class Boolean<Type extends boolean | null = boolean | null> extends AdvancedColumn<
  BooleanOptions<Type>
> {
  declare readonly primaryKey: () => Boolean<NonNullable<Type>>;

  declare readonly notNull: () => Boolean<NonNullable<Type>>;

  declare readonly default: (value: boolean) => Boolean<NonNullable<Type>>;

  protected getType() {
    return DataTypes.BOOLEAN;
  }
}
