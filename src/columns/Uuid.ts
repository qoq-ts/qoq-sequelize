import { DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface UuidOptions<T extends boolean | null> extends BaseColumnOptions<T> {}

export class Uuid<Type extends boolean | null = boolean | null> extends AdvancedColumn<
  UuidOptions<Type>
> {
  declare readonly primaryKey: () => Uuid<NonNullable<Type>>;

  declare readonly notNull: () => Uuid<NonNullable<Type>>;

  public default(value: 'uuid_v4' | 'uuid_v1'): Uuid<NonNullable<Type>> {
    // @ts-expect-error
    return super.default(value === 'uuid_v1' ? DataTypes.UUIDV1 : DataTypes.UUIDV4);
  }

  protected getType() {
    return DataTypes.UUID;
  }
}
