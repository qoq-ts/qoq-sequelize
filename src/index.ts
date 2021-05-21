import sequelize from 'sequelize';

export class Transaction extends sequelize.Transaction {}
export const { fn, literal, col, Op } = sequelize;
export type { Col, Literal, Fn } from 'sequelize/types/lib/utils';

export type { ModelInstance, ModelObject } from './types/custom/TransformModel';
export type { QueryInterface } from './types/override/QueryInterface';
export { defineModel } from './model/defineModel';
export { column } from './columns';
export { Sequelize, SequelizeOptions } from './model/Sequelize';
export { migration } from './migration/migration';
export { seed } from './migration/seed';
export { SequelizeSlot } from './slot/SequelizeSlot';
export { Order } from './types/override/Order';
