import { Association } from '../override/Association';
import { BelongsTo } from '../override/BelongsTo';
import { BelongsToCreateAssociationMixin } from '../override/BelongsToCreateAssociationMixin';
import { BelongsToGetAssociationMixin } from '../override/BelongsToGetAssociationMixin';
import { BelongsToMany } from '../override/BelongsToMany';
import { BelongsToManyAddAssociationMixin } from '../override/BelongsToManyAddAssociationMixin';
import { BelongsToManyAddAssociationsMixin } from '../override/BelongsToManyAddAssociationsMixin';
import { BelongsToManyCountAssociationsMixin } from '../override/BelongsToManyCountAssociationsMixin';
import { BelongsToManyCreateAssociationMixin } from '../override/BelongsToManyCreateAssociationMixin';
import { BelongsToManyGetAssociationsMixin } from '../override/BelongsToManyGetAssociationsMixin';
import { BelongsToManyHasAssociationMixin } from '../override/BelongsToManyHasAssociationMixin';
import { BelongsToManyHasAssociationsMixin } from '../override/BelongsToManyHasAssociationsMixin';
import { BelongsToManyRemoveAssociationMixin } from '../override/BelongsToManyRemoveAssociationMixin';
import { BelongsToManyRemoveAssociationsMixin } from '../override/BelongsToManyRemoveAssociationsMixin';
import { BelongsToManySetAssociationsMixin } from '../override/BelongsToManySetAssociationsMixin';
import { BelongsToSetAssociationMixin } from '../override/BelongsToSetAssociationMixin';
import { HasMany } from '../override/HasMany';
import { HasManyAddAssociationMixin } from '../override/HasManyAddAssociationMixin';
import { HasManyAddAssociationsMixin } from '../override/HasManyAddAssociationsMixin';
import { HasManyCountAssociationsMixin } from '../override/HasManyCountAssociationsMixin';
import { HasManyCreateAssociationMixin } from '../override/HasManyCreateAssociationMixin';
import { HasManyGetAssociationsMixin } from '../override/HasManyGetAssociationsMixin';
import { HasManyHasAssociationMixin } from '../override/HasManyHasAssociationMixin';
import { HasManyHasAssociationsMixin } from '../override/HasManyHasAssociationsMixin';
import { HasManyRemoveAssociationMixin } from '../override/HasManyRemoveAssociationMixin';
import { HasManyRemoveAssociationsMixin } from '../override/HasManyRemoveAssociationsMixin';
import { HasManySetAssociationsMixin } from '../override/HasManySetAssociationsMixin';
import { HasOne } from '../override/HasOne';
import { HasOneCreateAssociationMixin } from '../override/HasOneCreateAssociationMixin';
import { HasOneGetAssociationMixin } from '../override/HasOneGetAssociationMixin';
import { HasOneSetAssociationMixin } from '../override/HasOneSetAssociationMixin';
import { IncludeOptions } from '../override/IncludeOptions';
import { Model } from '../override/Model';
import { ModelStatic } from '../override/ModelStatic';
import { ScopeOptions } from '../override/ScopeOptions';
import { TModelScopes } from './ModelGenericType';
import { RealModel } from './TransformModel';

export type ModelToObject<M extends Model> = M['_attributes'] & {
  [K in keyof M['_type_assocs']]: AssociationToObject<M['_type_assocs'][K]>;
};

export type AssociationToObject<T> = T extends () => HasMany<any, infer R> | BelongsToMany<any, infer R>
  ? R extends Model ? ModelToObject<R>[] : never[]
  : T extends () => HasOne<any, infer R> | BelongsTo<any, infer R>
    ? R extends Model ? ModelToObject<R> : never
    : never;

export type AssociationToModel<T> = T extends () => HasMany<any, infer R> | BelongsToMany<any, infer R>
  ? R extends Model ? RealModel<R>[] : never[]
  : T extends () => HasOne<any, infer R> | BelongsTo<any, infer R>
    ? R extends Model ? RealModel<R> : never
    : never;

export type AssociationToModels<T extends object> = {
  [K in keyof T]: AssociationToModel<T[K]>;
};

export type Associate<T extends object> = {
  [K in keyof T]: IncludeFn<T[K]>;
};

export type IncludeFn<T, M extends Model = T extends () => Association<any, infer R> ? R : never, ScopeNames = keyof TModelScopes<M>> = (
  options?:
    Omit<IncludeOptions<M['_attributes']>, 'association' | 'model' | 'as' | 'through'> & {
    // WhereAttributeHash<M> should omit here.
    scope?: ScopeNames | 'defaultScope' | ScopeOptions<ScopeNames> | readonly (ScopeNames | 'defaultScope' | ScopeOptions<ScopeNames>)[];
  }
) => IncludeOptions<any>;

type Singular<K> = K extends `${string}ss`
  ? K
  : K extends `${infer R}s`
    ? R
    : K;

// @see https://sequelize.org/master/manual/assocs.html
export type AssociationMethods<M extends Model, T extends object = M['_type_assocs']> = {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `get${Capitalize<string & Singular<K>>}s`
    : `get${Capitalize<string & K>}`
  ]:
  T[K] extends () => HasOne<any, infer R>
    ? HasOneGetAssociationMixin<R>
    : T[K] extends () => BelongsTo<any, infer R>
      ? BelongsToGetAssociationMixin<R>
      : T[K] extends () => HasMany<any, infer R>
        ? HasManyGetAssociationsMixin<R>
        : T[K] extends () => BelongsToMany<any, infer R>
          ? BelongsToManyGetAssociationsMixin<R>
          : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `set${Capitalize<string & Singular<K>>}s`
    : `set${Capitalize<string & K>}`
  ]:
  T[K] extends () => HasOne<any, infer R>
    ? HasOneSetAssociationMixin<R, number>
    : T[K] extends () => BelongsTo<any, infer R>
      ? BelongsToSetAssociationMixin<R, number>
      : T[K] extends () => HasMany<any, infer R>
        ? HasManySetAssociationsMixin<R, number>
        : T[K] extends () => BelongsToMany<any, infer R>
          ? BelongsToManySetAssociationsMixin<R, number>
          : never;
}
& {
  [K in keyof T as
    T[K] extends () => HasMany | BelongsToMany
        ? `create${Capitalize<string & Singular<K>>}`
        : `create${Capitalize<string & K>}`
  ]:
  T[K] extends () => HasOne<any, infer R>
    ? HasOneCreateAssociationMixin<R>
    : T[K] extends () => BelongsTo<any, infer R>
      ? BelongsToCreateAssociationMixin<R>
      : T[K] extends () => HasMany<any, infer R>
        ? HasManyCreateAssociationMixin<R>
        : T[K] extends () => BelongsToMany<any, infer R>
          ? BelongsToManyCreateAssociationMixin<R>
          : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `has${Capitalize<string & Singular<K>>}`
    : never
  ]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyHasAssociationMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyHasAssociationMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `has${Capitalize<string & Singular<K>>}s`
    : never
  ]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyHasAssociationsMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyHasAssociationsMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `add${Capitalize<string & Singular<K>>}`
    : never
  ]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyAddAssociationMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyAddAssociationMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `add${Capitalize<string & Singular<K>>}s`
    : never
  ]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyAddAssociationsMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyAddAssociationsMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `remove${Capitalize<string & Singular<K>>}`
    : never
  ]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyRemoveAssociationMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyRemoveAssociationMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `remove${Capitalize<string & Singular<K>>}s`
    : never
  ]:
  T[K] extends () => HasMany<any, infer R>
    ? HasManyRemoveAssociationsMixin<R, number>
    : T[K] extends () => BelongsToMany<any, infer R>
      ? BelongsToManyRemoveAssociationsMixin<R, number>
      : never;
}
& {
  [K in keyof T as T[K] extends () => HasMany | BelongsToMany
    ? `count${Capitalize<string & Singular<K>>}s`
    : never
  ]:
  T[K] extends () => HasMany<any, any>
    ? HasManyCountAssociationsMixin
    : T[K] extends () => BelongsToMany<any, any>
      ? BelongsToManyCountAssociationsMixin
      : never;
};
