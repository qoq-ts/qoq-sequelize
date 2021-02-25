import { BaseColumn } from '../columns/BaseColumn';
import { IncludeAssociation, AssociationToModels } from '../types/custom/AssociationType';
import { RealColumnTypes } from '../types/custom/ColumnType';
import { Model } from '../types/override/model';
import { ModelCtor } from '../types/override/ModelCtor';
import { ModelOptions } from '../types/override/ModelOptions';
import { TemporaryModel } from './TemporaryModel';

export interface DefineModelOptions<
  Attrs extends object,
  Assocs extends object,
  Scopes extends object,
  RealAttrs extends object,
  > {
  attributes: Attrs;
  options?: ModelOptions<Model<RealAttrs>>;
  associations?: Assocs;
  scopes?: Scopes;
}

// Notice: don't put the computed type into Model generic, it will make type checking very slow.
export const defineModel = <
  Attrs extends Record<string, BaseColumn>,
  Assocs extends Record<string, Function>,
  Scopes extends Record<string, Function>,
  RealAttrs extends object = RealColumnTypes<Attrs>,
>(
  options: DefineModelOptions<Attrs, Assocs, Scopes, RealAttrs>
): ModelCtor<
  Model<RealAttrs, RealAttrs, Scopes, Assocs> & RealAttrs & AssociationToModels<Assocs>,
  IncludeAssociation<Assocs>
> => {
  // @ts-ignore
  return new TemporaryModel(options);
};
