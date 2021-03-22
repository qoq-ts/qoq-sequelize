import { Col, Fn, Literal } from 'sequelize/types/lib/utils';
import { OrderItem } from './OrderItem';

export type Order = Fn | Col | Literal | OrderItem[];
