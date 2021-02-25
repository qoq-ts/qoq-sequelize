import { Config, Options } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { Sequelize } from '../../model/Sequelize';
import { Model } from './Model';
import { ModelAttributes } from './ModelAttributes';
import { ModelHooks } from './ModelHooks';
import { ModelOptions } from './ModelOptions';

export interface SequelizeHooks<
  M extends Model<TAttributes, TCreationAttributes> = Model,
  TAttributes = any,
  TCreationAttributes = TAttributes
> extends ModelHooks<M, TAttributes> {
  beforeDefine(attributes: ModelAttributes<M, TCreationAttributes>, options: ModelOptions<M>): void;
  afterDefine(model: typeof Model): void;
  beforeInit(config: Config, options: Options): void;
  afterInit(sequelize: Sequelize): void;
  beforeConnect(config: Config): HookReturn;
  afterConnect(connection: unknown, config: Config): HookReturn;
  beforeDisconnect(connection: unknown): HookReturn;
  afterDisconnect(connection: unknown): HookReturn;
}
