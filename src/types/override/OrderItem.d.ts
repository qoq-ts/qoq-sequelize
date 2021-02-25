import { Col, Fn, Literal } from 'sequelize/types/lib/utils';
import { Model } from './Model';
import { ModelStatic } from './ModelStatic';

type OrderItemAssociation = { model: ModelStatic<Model>; as: string };

type OrderItemColumn = string | Col | Fn | Literal;

type Sort = 'ASC' | 'DESC';

export type OrderItem =
  | OrderItemColumn
  | [OrderItemColumn]
  | [OrderItemColumn, Sort]
  | [OrderItemAssociation, OrderItemColumn]
  | [OrderItemAssociation, OrderItemColumn, Sort]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemColumn]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemColumn, Sort]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemAssociation, OrderItemColumn]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemAssociation, OrderItemColumn, Sort]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemAssociation, OrderItemAssociation, OrderItemColumn]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemAssociation, OrderItemAssociation, OrderItemColumn, Sort]
