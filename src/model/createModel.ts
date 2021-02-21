import { Model, ModelCtor, ModelOptions } from 'sequelize';
import { BaseColumn } from '../columns/BaseColumn';
import { ExtendAssociation, IncludeAssociation, RealAssociationTypes } from '../types/custom/AssociationType';
import { RealColumnTypes } from '../types/custom/ColumnType';
import { TemporaryModel } from './TemporaryModel';

export interface CreateModelOptions<
  Attr extends object,
  Assoc extends object,
  Scope extends object,
  RealAttr extends object,
  > {
  attributes: Attr;
  getters?: { [K in keyof RealAttr]?: (this: Model<RealAttr> & Omit<RealAttr, K>) => RealAttr[K] };
  setters?: { [K in keyof RealAttr]?: (this: Model<RealAttr> & Omit<RealAttr, K>, value: RealAttr[K]) => void };
  options?: ModelOptions;
  associations?: Assoc;
  scopes?: Scope;
}

export const createModel = <
  Attr extends Record<string, BaseColumn>,
  Assoc extends Record<string, Function>,
  Scope extends Record<string, Function>,
  RealAttr extends object = RealColumnTypes<Attr>,
  IncludeAssoc extends object = IncludeAssociation<Assoc>,
  Extra = ExtendAssociation<Assoc> & RealAttr & RealAssociationTypes<Assoc>,
>(
  options: CreateModelOptions<Attr, Assoc, Scope, RealAttr>
): ModelCtor<Model<RealAttr> & Extra> & IncludeAssoc => {
  // @ts-ignore
  return new TemporaryModel(options);
};
