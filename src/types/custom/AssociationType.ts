import { BelongsTo, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToMany, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToSetAssociationMixin, HasMany, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, HasOne, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, IncludeOptions, Model, ModelStatic } from 'sequelize';

export type RealAssociationTypes<T extends object> = {
  [K in keyof T]: T[K] extends () => HasMany<any, infer R> | BelongsToMany<any, infer R>
    ? R[]
    : T[K] extends () => HasOne<any, infer R> | BelongsTo<any, infer R>
      ? R
      : never
};

export type IncludeAssociation<T extends object> = {
  [K in keyof T as `include${Capitalize<string & K>}`]: IncludeFn;
};

export type IncludeFn = (
  this: typeof Model & ModelStatic<Model>,
  options?: Omit<IncludeOptions, 'association' | 'model' | 'as'>
) => IncludeOptions & { model: typeof Model & ModelStatic<Model>; as: string };

type StripS<K> = K extends `${infer R}s` ? R : K;

// @see https://sequelize.org/master/manual/assocs.html
export type ExtendAssociation<T extends object> = {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? never : `get${Capitalize<string & K>}`]:
    T[K] extends () => HasOne<any, infer R>
      ? HasOneGetAssociationMixin<R>
      : T[K] extends () => BelongsTo<any, infer R>
        ? BelongsToGetAssociationMixin<R>
        : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `get${Capitalize<string & StripS<K>>}s` : never]:
    T[K] extends () => HasMany<any, infer R>
      ? HasManyGetAssociationsMixin<R>
      : T[K] extends () => BelongsToMany<any, infer R>
        ? BelongsToManyGetAssociationsMixin<R>
        : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? never : `set${Capitalize<string & K>}`]:
    T[K] extends () => HasOne<any, infer R>
      ? HasOneSetAssociationMixin<R, number>
      : T[K] extends () => BelongsTo<any, infer R>
        ? BelongsToSetAssociationMixin<R, number>
        : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `set${Capitalize<string & StripS<K>>}s` : never]:
    T[K] extends () => HasMany<any, infer R>
      ? HasManySetAssociationsMixin<R, number>
      : T[K] extends () => BelongsToMany<any, infer R>
        ? BelongsToManySetAssociationsMixin<R, number>
        : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? never : `create${Capitalize<string & K>}`]:
    T[K] extends () => HasOne<any, infer R>
      ? HasOneCreateAssociationMixin<R>
      : T[K] extends () => BelongsTo<any, infer R>
        ? BelongsToCreateAssociationMixin<R>
        : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `create${Capitalize<string & StripS<K>>}` : never]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyCreateAssociationMixin<R>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyCreateAssociationMixin<R>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `has${Capitalize<string & StripS<K>>}` : never]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyHasAssociationMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyHasAssociationMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `has${Capitalize<string & StripS<K>>}s` : never]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyHasAssociationsMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyHasAssociationsMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `add${Capitalize<string & StripS<K>>}` : never]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyAddAssociationMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyAddAssociationMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `add${Capitalize<string & StripS<K>>}s` : never]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyAddAssociationsMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyAddAssociationsMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `remove${Capitalize<string & StripS<K>>}` : never]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyRemoveAssociationMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyRemoveAssociationMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany ? `remove${Capitalize<string & StripS<K>>}s` : never]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyRemoveAssociationsMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyRemoveAssociationsMixin<R, number>
      : never;
};
