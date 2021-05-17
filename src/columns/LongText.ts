import { AbstractText, AbstractTextOptions } from './AbstractText';

interface LongTextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class LongText<Type extends string | null = string | null> extends AbstractText<
  LongTextOptions<Type>
> {
  constructor() {
    super({
      length: 'long',
    });
  }

  declare readonly primaryKey: () => LongText<NonNullable<Type>>;

  declare readonly notNull: () => LongText<NonNullable<Type>>;

  declare readonly default: (value: string) => LongText<NonNullable<Type>>;
}
