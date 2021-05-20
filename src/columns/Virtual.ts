import sequelize, { ModelAttributeColumnOptions, VirtualDataTypeConstructor } from 'sequelize';
import { RealColumnType } from '../types/custom/ColumnType';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumn, BaseColumnOptions } from './BaseColumn';

export class ColumnVirtual<T = unknown> extends BaseColumn<BaseColumnOptions<T>> {
  protected type?: AdvancedColumn;
  protected fields?: string[];

  /**
   * @see sequelize.DataTypes.VIRTUAL
   */
  public returnType<Type extends AdvancedColumn>(
    columnType: Type,
    dependentFields?: string[],
  ): ColumnVirtual<RealColumnType<Type>> {
    this.type = columnType;
    this.fields = dependentFields;
    // @ts-expect-error
    return this;
  }

  public notNull(): ColumnVirtual<NonNullable<T>> {
    // @ts-expect-error
    return this;
  }

  protected getType() {
    return sequelize.DataTypes.VIRTUAL;
  }

  public /*protected*/ collect(): ModelAttributeColumnOptions {
    const config = super.collect();

    if (this.type) {
      const realType = this.type.collect().type;

      if (typeof realType !== 'string') {
        config.type = (config.type as VirtualDataTypeConstructor)(realType, this.fields);
      }
    }

    return config;
  }
}
