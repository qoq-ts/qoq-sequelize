import { Fn, Literal } from 'sequelize/types/lib/utils';

/**
 * Please note if this is used the aliased property will not be available on the model instance
 * as a property but only via `instance.get('alias')`.
 */
export type ProjectionAlias<AttrsKeys> = readonly [AttrsKeys | Literal | Fn, string];
