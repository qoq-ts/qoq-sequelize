import { AbstractText, AbstractTextOptions } from './AbstractText';

interface MediumTextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class MediumText<Type extends string | null = string | null> extends AbstractText<
  MediumTextOptions<Type>
> {
  constructor() {
    super({
      length: 'medium',
    });
  }

  declare readonly primaryKey: () => MediumText<NonNullable<Type>>;

  declare readonly notNull: () => MediumText<NonNullable<Type>>;

  declare readonly default: (value: string) => MediumText<NonNullable<Type>>;
}
