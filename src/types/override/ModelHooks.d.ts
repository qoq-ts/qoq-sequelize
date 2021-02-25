import { DestroyOptions, InstanceDestroyOptions, InstanceRestoreOptions, InstanceUpdateOptions, RestoreOptions, SyncOptions, UpdateOptions } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { ValidationOptions } from 'sequelize/types/lib/instance-validator';
import { BulkCreateOptions } from './BulkCreateOptions';
import { CountOptions } from './CountOptions';
import { CreateOptions } from './CreateOptions';
import { FindOptions } from './FindOptions';
import { Model } from './Model';

/**
 * Options for Model.init. We mostly duplicate the Hooks here, since there is no way to combine the two
 * interfaces.
 */
export interface ModelHooks<M extends Model = Model, TAttributes = any> {
  beforeValidate(instance: M, options: ValidationOptions): HookReturn;
  afterValidate(instance: M, options: ValidationOptions): HookReturn;
  beforeCreate(attributes: M, options: CreateOptions<TAttributes>): HookReturn;
  afterCreate(attributes: M, options: CreateOptions<TAttributes>): HookReturn;
  beforeDestroy(instance: M, options: InstanceDestroyOptions): HookReturn;
  afterDestroy(instance: M, options: InstanceDestroyOptions): HookReturn;
  beforeRestore(instance: M, options: InstanceRestoreOptions): HookReturn;
  afterRestore(instance: M, options: InstanceRestoreOptions): HookReturn;
  beforeUpdate(instance: M, options: InstanceUpdateOptions<TAttributes>): HookReturn;
  afterUpdate(instance: M, options: InstanceUpdateOptions<TAttributes>): HookReturn;
  beforeSave(
    instance: M,
    options: InstanceUpdateOptions<TAttributes> | CreateOptions<TAttributes>
  ): HookReturn;
  afterSave(
    instance: M,
    options: InstanceUpdateOptions<TAttributes> | CreateOptions<TAttributes>
  ): HookReturn;
  beforeBulkCreate(instances: M[], options: BulkCreateOptions<TAttributes>): HookReturn;
  afterBulkCreate(instances: readonly M[], options: BulkCreateOptions<TAttributes>): HookReturn;
  beforeBulkDestroy(options: DestroyOptions<TAttributes>): HookReturn;
  afterBulkDestroy(options: DestroyOptions<TAttributes>): HookReturn;
  beforeBulkRestore(options: RestoreOptions<TAttributes>): HookReturn;
  afterBulkRestore(options: RestoreOptions<TAttributes>): HookReturn;
  beforeBulkUpdate(options: UpdateOptions<TAttributes>): HookReturn;
  afterBulkUpdate(options: UpdateOptions<TAttributes>): HookReturn;
  beforeFind(options: FindOptions<TAttributes>): HookReturn;
  beforeCount(options: CountOptions<TAttributes>): HookReturn;
  beforeFindAfterExpandIncludeAll(options: FindOptions<TAttributes>): HookReturn;
  beforeFindAfterOptions(options: FindOptions<TAttributes>): HookReturn;
  afterFind(instancesOrInstance: readonly M[] | M | null, options: FindOptions<TAttributes>): HookReturn;
  beforeSync(options: SyncOptions): HookReturn;
  afterSync(options: SyncOptions): HookReturn;
  beforeBulkSync(options: SyncOptions): HookReturn;
  afterBulkSync(options: SyncOptions): HookReturn;
}
