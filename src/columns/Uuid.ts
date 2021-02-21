import { DataTypes } from 'sequelize';
import { AdvancedColumn } from './AdvancedColumn';
import { BaseColumnOptions } from './BaseColumn';

export interface UuidOptions<T extends boolean | null> extends BaseColumnOptions<T> {}

export class Uuid<Type extends boolean | null = boolean | null> extends AdvancedColumn<UuidOptions<Type>> {
  public primaryKey(): Uuid<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Uuid<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: 'uuid_v4' | 'uuid_v1'): Uuid<NonNullable<Type>> {
    return super.default(value === 'uuid_v1' ? DataTypes.UUIDV1 : DataTypes.UUIDV4);
  }

  protected getType() {
    return DataTypes.UUID;
  }
}
