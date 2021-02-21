import { AbstractText, AbstractTextOptions } from './AbstractText';

interface MediumTextOptions<T extends string | null> extends AbstractTextOptions<T> {}

export class MediumText<Type extends string | null = string | null> extends AbstractText<MediumTextOptions<Type>> {
  constructor() {
    super({
      length: 'medium',
    });
  }

  public primaryKey(): MediumText<NonNullable<Type>> {
    return super.primaryKey();
  }

  public notNull(): MediumText<NonNullable<Type>> {
    return super.notNull();
  }

  public default(value: string): MediumText<NonNullable<Type>> {
    return super.default(value);
  }
}
