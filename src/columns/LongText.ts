import { AbstractText, AbstractTextOptions } from './AbstractText';

interface LongTextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class LongText<Type extends string | null = string | null> extends AbstractText<LongTextOptions<Type>> {
  constructor() {
    super({
      length: 'long',
    });
  }

  public primaryKey(): LongText<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): LongText<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): LongText<NonNullable<Type>> {
    return super.default(value);
  }
}
