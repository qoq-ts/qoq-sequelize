import { ModelIndexesOptions, ModelNameOptions, ModelValidateOptions } from 'sequelize';
import { FindOptions } from './FindOptions';
import { Model } from './Model';
import { ModelHooks } from './ModelHooks';

/**
 * ###################
 * Omit: scope
 * ###################
 */

/**
 * Options for model definition
 */
export interface ModelOptions<
  M extends Model = Model,
  Timestamp extends boolean | undefined = undefined,
  Created extends string | boolean | undefined = undefined,
  Updated extends string | boolean | undefined = undefined,
  Deleted extends string | boolean | undefined = undefined,
  Paranoid extends boolean | undefined = undefined,
> {
  /**
   * Define the default search scope to use for this model. Scopes have the same form as the options passed to
   * find / findAll.
   */
  defaultScope?: FindOptions<M['_attributes']>;

  /**
   * More scopes, defined in the same way as defaultScope above. See `Model.scope` for more information about
   * how scopes are defined, and what you can do with them
   */
  // scopes?: ModelScopeOptions<M['_attributes']>;

  /**
   * Don't persits null values. This means that all columns with null values will not be saved.
   */
  omitNull?: boolean;

  /**
   * Adds createdAt and updatedAt timestamps to the model. Default true.
   */
  timestamps?: Timestamp;

  /**
   * Calling destroy will not delete the model, but instead set a deletedAt timestamp if this is true. Needs
   * timestamps=true to work. Default false.
   */
  paranoid?: Paranoid;

  /**
   * Converts all camelCased columns to underscored if true. Default false.
   */
  underscored?: boolean;

  /**
   * Indicates if the model's table has a trigger associated with it. Default false.
   */
  hasTrigger?: boolean;

  /**
   * If freezeTableName is true, sequelize will not try to alter the DAO name to get the table name.
   * Otherwise, the dao name will be pluralized. Default false.
   */
  freezeTableName?: boolean;

  /**
   * An object with two attributes, `singular` and `plural`, which are used when this model is associated to
   * others.
   */
  name?: ModelNameOptions;

  /**
   * Set name of the model. By default its same as Class name.
   */
  modelName?: string;

  /**
   * Indexes for the provided database table
   */
  indexes?: readonly ModelIndexesOptions[];

  /**
   * Override the name of the createdAt column if a string is provided, or disable it if false. Timestamps
   * must be true. Not affected by underscored setting.
   */
  createdAt?: Created;

  /**
   * Override the name of the deletedAt column if a string is provided, or disable it if false. Timestamps
   * must be true. Not affected by underscored setting.
   */
  deletedAt?: Deleted;

  /**
   * Override the name of the updatedAt column if a string is provided, or disable it if false. Timestamps
   * must be true. Not affected by underscored setting.
   */
  updatedAt?: Updated;

  /**
   * @default pluralized model name, unless freezeTableName is true, in which case it uses model name
   * verbatim
   */
  tableName?: string;

  schema?: string;

  /**
   * You can also change the database engine, e.g. to MyISAM. InnoDB is the default.
   */
  engine?: string;

  charset?: string;

  /**
   * Finaly you can specify a comment for the table in MySQL and PG
   */
  comment?: string;

  collate?: string;

  /**
   * Set the initial AUTO_INCREMENT value for the table in MySQL.
   */
  initialAutoIncrement?: string;

  /**
   * An object of hook function that are called before and after certain lifecycle events.
   * See Hooks for more information about hook
   * functions and their signatures. Each property can either be a function, or an array of functions.
   */
  hooks?: Partial<ModelHooks<M, M['_attributes']>>;

  /**
   * An object of model wide validations. Validations have access to all model values via `this`. If the
   * validator function takes an argument, it is asumed to be async, and is called with a callback that
   * accepts an optional error.
   */
  validate?: ModelValidateOptions;

  /**
   * Allows defining additional setters that will be available on model instances.
   */
  setterMethods?: { [K in keyof M['_attributes']]?: (this: Model<M['_attributes']> & M['_attributes'], value: M['_attributes'][K]) => void };

  /**
   * Allows defining additional getters that will be available on model instances.
   */
  getterMethods?: { [K in keyof M['_attributes']]?: (this: Model<M['_attributes']> & M['_attributes']) => M['_attributes'][K] };

  /**
   * Enable optimistic locking.
   * When enabled, sequelize will add a version count attribute to the model and throw an
   * OptimisticLockingError error when stale instances are saved.
   * - If string: Uses the named attribute.
   * - If boolean: Uses `version`.
   * @default false
   */
  version?: boolean | string;
}
