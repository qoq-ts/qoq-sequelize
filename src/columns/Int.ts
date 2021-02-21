import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface IntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class Int<Type extends number | null = number | null> extends AbstractNumber<IntOptions<Type>> {
  public primaryKey(): Int<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Int<NonNullable<Type>> {
    this.config.allowNull = false;
    // @ts-expect-error
    return this;
  }

  public default(value: number): Int<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.INTEGER;
  }
}
