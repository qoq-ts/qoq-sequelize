import { DataTypes } from 'sequelize';
import { BaseColumn, BaseColumnOptions } from './BaseColumn';
import { AliasType, AvailableTypes } from './Alias';

export class ColumnVirtual<T = null> extends BaseColumn<BaseColumnOptions<T>> {
  public type<As extends AvailableTypes>(
    // @ts-expect-error
    as: As
  ): ColumnVirtual<(null extends T ? null : AliasType<As>) | AliasType<As>> {
    // @ts-expect-error
    return this;
  }

  public notNull(): ColumnVirtual<NonNullable<T>> {
    // @ts-expect-error
    return this;
  }

  protected getType() {
    return DataTypes.VIRTUAL;
  }
}
