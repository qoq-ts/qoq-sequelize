import { DataTypes, EnumDataTypeConstructor, EnumDataType, ModelAttributeColumnOptions } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface EnumOptions<T extends string | null> extends BaseColumnOptions<T> {
  type: EnumDataTypeConstructor | EnumDataType<NonNullable<T>>
}

export class Enum<Type extends string | null = null> extends AdvancedColumn<EnumOptions<Type>> {
  protected enumValues: any[] = [];

  public primaryKey(): Enum<NonNullable<Type>> {
    return super.primaryKey();
  }

  public values<T extends string>(values: T[]): Enum<T | (null extends Type ? null : T)> {
    this.enumValues = values;
    // @ts-expect-error
    return this;
  }

  public default(value: NonNullable<Type>): Enum<NonNullable<Type>> {
    return super.default(value);
  }

  public notNull(): Enum<NonNullable<Type>> {
    return super.notNull();
  }

  public/*protected*/ collect(): ModelAttributeColumnOptions {
    this.config.type = (this.config.type as EnumDataTypeConstructor)({
      values: this.enumValues,
    });

    return super.collect();
  }

  protected getType() {
    return DataTypes.DATEONLY;
  }
}
