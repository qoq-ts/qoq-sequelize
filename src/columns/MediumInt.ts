import sequelize from 'sequelize';
import { AbstractNumber, AbstractNumberOptions } from './AbstractNumber';

interface MediumIntOptions<T extends number | null> extends AbstractNumberOptions<T> {}

export class MediumInt<Type extends number | null = number | null> extends AbstractNumber<
  MediumIntOptions<Type>
> {
  declare readonly primaryKey: () => MediumInt<NonNullable<Type>>;

  declare readonly notNull: () => MediumInt<NonNullable<Type>>;

  declare readonly default: (value: number) => MediumInt<NonNullable<Type>>;

  protected getType() {
    return sequelize.DataTypes.MEDIUMINT;
  }
}
