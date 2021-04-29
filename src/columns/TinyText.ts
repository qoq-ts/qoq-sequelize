import { AbstractText, AbstractTextOptions } from './AbstractText';

interface TinyTextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class TinyText<Type extends string | null = string | null> extends AbstractText<TinyTextOptions<Type>> {
  constructor() {
    super({
      length: 'tiny',
    });
  }

  declare readonly primaryKey: () => TinyText<NonNullable<Type>>;

  declare readonly notNull: () => TinyText<NonNullable<Type>>;

  declare readonly default: (value: string) => TinyText<NonNullable<Type>>;
}
