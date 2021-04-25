import { Col, Fn, Literal } from 'sequelize/types/lib/utils';

export declare class FakeOrder {
  private __real_data__: 'stringArray | objectArray';
}

export type OrderItem = Col | Fn | Literal | FakeOrder;
