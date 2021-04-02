import { Model } from '../override/Model';

export type TModelAttrs<M extends Model> = M extends Model<infer R> ? R : {};

export type TModelCreationAttrs<M extends Model> = M extends Model<any, infer R> ? R : {};

export type TModelScopes<M extends Model> = M extends Model<any, any, infer R> ? R : {};

export type TModelAssocs<M extends Model> = M extends Model<any, any, any, infer R> ? R : {};
