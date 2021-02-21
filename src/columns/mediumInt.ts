import { DataTypes } from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface MediumIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class MediumInt<Type extends number | null = number | null> extends AbstractNumber<MediumIntOptions<Type>> {
  public primaryKey(): MediumInt<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): MediumInt<NonNullable<Type>> {
    this.config.allowNull = false;
    // @ts-expect-error
    return this;
  }

  public default(value: number): MediumInt<NonNullable<Type>> {
    return super.default(value);
  }

  protected getType() {
    return DataTypes.MEDIUMINT;
  }
}
