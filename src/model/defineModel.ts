import { BaseColumn } from '../columns/BaseColumn';
import { Associate } from '../types/custom/AssociationType';
import { RealColumnTypes, TimestampType } from '../types/custom/ColumnType';
import { Model } from '../types/override/Model';
import { ModelCtor } from '../types/override/ModelCtor';
import { ModelOptions } from '../types/override/ModelOptions';
import { TemporaryModel } from './TemporaryModel';

export interface DefineModelOptions<
  Attrs extends object,
  Assocs extends object,
  Scopes extends object,
  RealAttrs extends object,
  Timestamp extends boolean | undefined,
  Created extends string | boolean | undefined,
  Updated extends string | boolean | undefined,
  Deleted extends string | boolean | undefined,
  Paranoid extends boolean | undefined,
  > {
  attributes: Attrs;
  options?: ModelOptions<Model<RealAttrs>, Timestamp, Created, Updated, Deleted, Paranoid>;
  associations?: Assocs;
  scopes?: Scopes;
}

// Notice: don't put the computed type into Model generic, it will make type checking very slow.
export const defineModel = <
  Attrs extends Record<string, BaseColumn>,
  Assocs extends Record<string, Function>,
  Scopes extends Record<string, Function>,
  RealAttrs extends object = RealColumnTypes<Attrs>,
  Timestamp extends boolean | undefined = undefined,
  Created extends string | boolean | undefined = undefined,
  Updated extends string | boolean | undefined = undefined,
  Deleted extends string | boolean | undefined = undefined,
  Paranoid extends boolean | undefined = undefined,
>(
  options: DefineModelOptions<Attrs, Assocs, Scopes, RealAttrs, Timestamp, Created, Updated, Deleted, Paranoid>
): ModelCtor<
  Model<RealAttrs & TimestampType<Timestamp, Created, Updated, Deleted, Paranoid>, Partial<RealAttrs>, Scopes, Assocs>,
  Associate<Assocs>
> => {
  const Custom = class extends TemporaryModel {
    static __INIT__ = options;
  }

  // @ts-ignore
  return Custom;
};
