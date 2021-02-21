import { AbstractTextOptions, AbstractText } from './AbstractText';

interface TextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class Text<Type extends string | null = string | null> extends AbstractText<TextOptions<Type>> {
  public primaryKey(): Text<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): Text<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): Text<NonNullable<Type>> {
    return super.default(value);
  }
}
