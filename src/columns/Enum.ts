import { DataTypes, EnumDataTypeConstructor, EnumDataType, ModelAttributeColumnOptions } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface EnumOptions<T extends string | null> extends BaseColumnOptions<T> {
  type: EnumDataTypeConstructor | EnumDataType<NonNullable<T>>
}

export class Enum<Type extends string | null = null> extends AdvancedColumn<EnumOptions<Type>> {
  protected enumValues: any[] = [];

  declare readonly primaryKey: () => Enum<NonNullable<Type>>;

  public values<T extends string>(values: T[]): Enum<T | (null extends Type ? null : T)> {
    this.enumValues = values;
    // @ts-expect-error
    return this;
  }

  declare readonly default: (value: NonNullable<Type>) => Enum<NonNullable<Type>>;

  declare readonly notNull: () => Enum<NonNullable<Type>>;

  public/*protected*/ collect(): ModelAttributeColumnOptions {
    const config = super.collect();

    config.type = (config.type as EnumDataTypeConstructor)({
      values: this.enumValues,
    });

    return config;
  }

  protected getType() {
    return DataTypes.DATEONLY;
  }
}
