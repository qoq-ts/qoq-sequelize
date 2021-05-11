import { Model } from '../override/Model';
import { ModelCtor } from '../override/ModelCtor';
import { AssociationMethods, AssociationToModels, AssociationToObject } from './AssociationType';

export type ModelInstance<T extends ModelCtor<any, any>, M extends Model = T extends ModelCtor<infer R> ? R : Model> = RealModel<M>;

export type RealModel<M extends Model, T extends object = M['_type_assocs']> = M & M['_attributes'] & AssociationToModels<T> & AssociationMethods<M>;

export type ModelObject<T extends ModelCtor<any, any>, P extends Model = T extends ModelCtor<infer R> ? R : Model> = P['_attributes'] & {
  [K in keyof P['_type_assocs']]: AssociationToObject<P['_type_assocs'][K]>;
} & { [key: string]: unknown };
