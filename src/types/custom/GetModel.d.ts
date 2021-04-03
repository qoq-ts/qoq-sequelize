import { Model } from '../override/Model';
import { ModelCtor } from '../override/ModelCtor';
import { AssociationMethods, AssociationToObject, ModelToObject } from './AssociationType';

export type GetModel<T extends ModelCtor<any, any>, P extends Model = T extends ModelCtor<infer R> ? R : Model> = AssociationMethods<P>;

export type GetPlainModel<T extends ModelCtor<any, any>, P extends Model = T extends ModelCtor<infer R> ? R : Model> = P['_attributes'] & {
  [K in keyof P['_type_assocs']]: AssociationToObject<P['_type_assocs'][K]>;
};
