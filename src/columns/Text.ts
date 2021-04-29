import { AbstractTextOptions, AbstractText } from './AbstractText';

interface TextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class Text<Type extends string | null = string | null> extends AbstractText<TextOptions<Type>> {
  declare readonly primaryKey: () => Text<NonNullable<Type>>;

  declare readonly notNull: () => Text<NonNullable<Type>>;

  declare readonly default: (value: string) => Text<NonNullable<Type>>;
}
