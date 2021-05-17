import { Col, Fn, Literal } from 'sequelize/types/lib/utils';
import { Association } from '../override/Association';
import { Model } from '../override/Model';
import { OrderItem } from '../override/OrderItem';

interface OrderType<Attrs extends object> {
  // TODO: For alias attribute, using col('') or consider { alias: string }
  (column: keyof Attrs | Fn | Literal | Col): OrderItem;
}

type OrderIncludeObject<
  T,
  M extends Model = T extends () => Association<any, infer R> ? R : never,
> = OrderChain<M['_type_assocs'], M['_attributes']>;

export type OrderChain<T extends object, Attrs extends object> = {
  readonly [K in keyof T]: OrderIncludeObject<T[K]>;
} & {
  readonly asc: OrderType<Attrs>;
  readonly desc: OrderType<Attrs>;
};
