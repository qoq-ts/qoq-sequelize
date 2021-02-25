import { DataTypes } from 'sequelize';
import { BaseColumn, BaseColumnOptions } from './BaseColumn';

export type AvailableTypes = 'number' | 'string' | 'date' | 'buffer' | 'boolean';

export type AliasType<As> = (
  As extends 'number'
    ? number
    : As extends 'string'
      ? string
      : As extends 'date'
        ? Date
        : As extends 'buffer'
          ? Buffer
          : As extends 'boolean'
            ? boolean
            : unknown
);

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
