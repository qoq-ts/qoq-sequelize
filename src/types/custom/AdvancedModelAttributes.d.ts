import { BaseColumn } from '../../columns/BaseColumn';

export type AdvancedModelAttributes = {
  [key in string]: BaseColumn;
};
