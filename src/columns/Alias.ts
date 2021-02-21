import { DataTypes } from 'sequelize';
import { BaseColumn, BaseColumnOptions } from './BaseColumn';

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

export type AvailableTypes = 'number' | 'string' | 'date' | 'buffer' | 'boolean';

export class ColumnAlias<T = null> extends BaseColumn<BaseColumnOptions<T>> {
  public type<As extends AvailableTypes>(
    // @ts-expect-error
    as: As
  ): ColumnAlias<(null extends T ? null : AliasType<As>) | AliasType<As>> {
    // @ts-expect-error
    return this;
  }

  public notNull(): ColumnAlias<NonNullable<T>> {
    // @ts-expect-error
    return this;
  }

  public/*protected*/ collect(): false {
    return false;
  }

  protected getType() {
    return DataTypes.ABSTRACT;
  }
}
