import { BaseColumn, BaseColumnOptions } from '../../columns/BaseColumn';

export type RealColumnTypes<T extends object> = {
  [K in keyof T]: RealColumnType<T[K]>;
};

export type RealColumnType<T> = T extends BaseColumn<infer Options>
  ? Options extends BaseColumnOptions<infer R>
    ? R
    : never
  : never;

export type TimestampType<
  Timestamp extends boolean | undefined,
  Created extends string | boolean | undefined,
  Updated extends string | boolean | undefined,
  Deleted extends string | boolean | undefined,
  Paranoid extends boolean | undefined,
> = Timestamp extends false
  ? {}
  : {
      [K in 'createdAt' as Created extends false
        ? never
        : Created extends string
        ? Created
        : K]: Date;
    } &
      {
        [K in 'updatedAt' as Updated extends false
          ? never
          : Updated extends string
          ? Updated
          : K]: Date;
      } &
      (Paranoid extends true
        ? {
            [K in 'deletedAt' as Deleted extends false
              ? never
              : Deleted extends string
              ? Deleted
              : K]: Date | null;
          }
        : {});
