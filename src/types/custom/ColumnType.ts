import { BaseColumn, BaseColumnOptions } from '../../columns/BaseColumn';

export type RealColumnTypes<T extends object> = {
  [K in keyof T]: RealColumnType<T[K]>;
};

export type RealColumnType<T> =
T extends BaseColumn<infer Options>
  ? Options extends BaseColumnOptions<infer R>
    ? R
    : never
  : never;
