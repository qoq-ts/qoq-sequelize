import { AbstractText, AbstractTextOptions } from './AbstractText';

interface TinyTextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class TinyText<Type extends string | null = string | null> extends AbstractText<TinyTextOptions<Type>> {
  constructor() {
    super({
      length: 'tiny',
    });
  }

  public primaryKey(): TinyText<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): TinyText<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): TinyText<NonNullable<Type>> {
    return super.default(value);
  }
}
