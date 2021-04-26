import { AddScopeOptions, DataType, DestroyOptions, DropOptions, Identifier, IncrementDecrementOptions, IncrementDecrementOptionsWithBy, InstanceDestroyOptions, InstanceRestoreOptions, InstanceUpdateOptions, RestoreOptions, SaveOptions, SchemaOptions, SetOptions, SyncOptions, TruncateOptions, UpdateOptions, UpsertOptions, WhereAttributeHash } from 'sequelize';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { ValidationOptions } from 'sequelize/types/lib/instance-validator';
import { Sequelize } from '../../model/Sequelize';
import { AssociationToObject, AssociationToModel, AssociationToModels, Associate } from '../custom/AssociationType';
import { TModelScopes, TModelAssocs } from '../custom/ModelGenericType';
import { OrderChain } from '../custom/OrderChain';
import { RealModel } from '../custom/TransformModel';
import { AggregateOptions } from './AggregateOptions';
import { Association } from './Association';
import { BelongsTo } from './BelongsTo';
import { BelongsToMany } from './BelongsToMany';
import { BelongsToManyOptions } from './BelongsToManyOptions';
import { BelongsToOptions } from './BelongsToOptions';
import { BuildOptions } from './BuildOptions';
import { BulkCreateOptions } from './BulkCreateOptions';
import { CountOptions } from './CountOptions';
import { CountWithOptions } from './CountWithOptions';
import { CreateOptions } from './CreateOptions';
import { FindAndCountOptions } from './FindAndCountOptions';
import { FindOptions } from './FindOptions';
import { FindOrCreateOptions } from './FindOrCreateOptions';
import { HasMany } from './HasMany';
import { HasManyOptions } from './HasManyOptions';
import { HasOne } from './HasOne';
import { HasOneOptions } from './HasOneOptions';
import { Hooks } from './Hooks';
import { InitOptions } from './InitOptions';
import { ModelAttributeColumnOptions } from './ModelAttributeColumnOptions';
import { ModelCtor } from './ModelCtor';
import { ModelStatic } from './ModelStatic';
import { ModelType } from './ModelType';
import { NonNullFindOptions } from './NonNullFindOptions';
import { ScopeOptions } from './ScopeOptions';

// ###################
// Omit:
//   Model.init()
// ###################

export abstract class Model<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes,
  Scopes extends {} = any,
  Assocs extends {} = any,
> extends Hooks<Model<TModelAttributes, TCreationAttributes>, TModelAttributes, TCreationAttributes>
{
  /**
   * A dummy variable that doesn't exist on the real object. This exists so
   * Typescript can infer the type of the attributes in static functions. Don't
   * try to access this!
   *
   * Before using these, I'd tried typing out the functions without them, but
   * Typescript fails to infer `TAttributes` in signatures like the below.
   *
   * ```ts
   * public static findOne<M extends Model<TAttributes>, TAttributes>(
   *   this: { new(): M },
   *   options: NonNullFindOptions<TAttributes>
   * ): Promise<M>;
   * ```
   */
  _attributes: TModelAttributes;
  /**
   * A similar dummy variable that doesn't exist on the real object. Do not
   * try to access this in real code.
   */
  _creationAttributes: TCreationAttributes;

  /**
   * A similar dummy variable that doesn't exist on the real object. Do not
   * try to access this in real code.
   *
   * We don't use types from here, but they just need to explicitly be here by no reason.
   */
  private _type_scopes: Scopes;
  _type_assocs: Assocs;

  /** The name of the database table */
  public static readonly tableName: string;

  /**
   * The name of the primary key attribute
   */
  public static readonly primaryKeyAttribute: string;

  /**
   * The name of the primary key attributes
   */
  public static readonly primaryKeyAttributes: readonly string[];

  /**
   * An object hash from alias to association object
   */
  public static readonly associations: {
    [key: string]: Association;
  };

  /**
   * The options that the model was initialized with
   */
  public static readonly options: InitOptions;

  /**
   * The attributes of the model
   */
  public static readonly rawAttributes: { [attribute: string]: ModelAttributeColumnOptions };

  /**
   * Reference to the sequelize instance the model was initialized with
   */
  public static readonly sequelize?: Sequelize;

  /**
   * Remove attribute from model definition
   *
   * @param attribute
   */
  public static removeAttribute<M extends Model>(this: ModelStatic<M>, attribute: keyof M['_attributes']): void;

  /**
   * Sync this Model to the DB, that is create the table. Upon success, the callback will be called with the
   * model instance (this)
   */
  public static sync<M extends Model>(options?: SyncOptions): Promise<M>;

  /**
   * Drop the table represented by this Model
   *
   * @param options
   */
  public static drop(options?: DropOptions): Promise<void>;

  /**
   * Apply a schema to this model. For postgres, this will actually place the schema in front of the table
   * name
   * - `"schema"."tableName"`, while the schema will be prepended to the table name for mysql and
   * sqlite - `'schema.tablename'`.
   *
   * @param schema The name of the schema
   * @param options
   */
  public static schema<M extends Model>(
    this: ModelStatic<M>,
    schema: string,
    options?: SchemaOptions
  ): ModelCtor<M>;

  /**
   * Get the tablename of the model, taking schema into account. The method will return The name as a string
   * if the model has no schema, or an object with `tableName`, `schema` and `delimiter` properties.
   *
   * @param options The hash of options from any query. You can use one model to access tables with matching
   *     schemas by overriding `getTableName` and using custom key/values to alter the name of the table.
   *     (eg.
   *     subscribers_1, subscribers_2)
   */
  public static getTableName(): string | {
    tableName: string;
    schema: string;
    delimiter: string;
  };

  /**
   * Apply a scope created in `define` to the model. First let's look at how to create scopes:
   * ```js
   * class MyModel extends Model {}
   * MyModel.init(attributes, {
   *   defaultScope: {
   *     where: {
   *       username: 'dan'
   *     },
   *     limit: 12
   *   },
   *   scopes: {
   *     isALie: {
   *       where: {
   *         stuff: 'cake'
   *       }
   *     },
   *     complexFunction(email, accessLevel) {
   *       return {
   *         where: {
   *           email: {
   *             [Op.like]: email
   *           },
   *           accesss_level {
   *             [Op.gte]: accessLevel
   *           }
   *         }
   *       }
   *     }
   *   },
   *   sequelize,
   * })
   * ```
   * Now, since you defined a default scope, every time you do Model.find, the default scope is appended to
   * your query. Here's a couple of examples:
   * ```js
   * Model.findAll() // WHERE username = 'dan'
   * Model.findAll({ where: { age: { gt: 12 } } }) // WHERE age > 12 AND username = 'dan'
   * ```
   *
   * To invoke scope functions you can do:
   * ```js
   * Model.scope({ method: ['complexFunction' 'dan@sequelize.com', 42]}).findAll()
   * // WHERE email like 'dan@sequelize.com%' AND access_level >= 42
   * ```
   *
   * @return Model A reference to the model, with the scope(s) applied. Calling scope again on the returned
   *  model will clear the previous scope.
   */
  public static scope<M extends Model, Scopes = TModelScopes<M>, ScopeNames extends keyof Scopes = keyof Scopes>(
    this: ModelStatic<M>,
    options?: ScopeNames | 'defaultScope' | ScopeOptions<ScopeNames> | readonly (ScopeNames | 'defaultScope' | ScopeOptions<ScopeNames>)[] | WhereAttributeHash<M>
  ): ModelCtor<
    M,
    Associate<TModelAssocs<M>>,
    OrderChain<M['_type_assocs'], M['_attributes']>
  >;

  /**
   * Add a new scope to the model
   *
   * This is especially useful for adding scopes with includes, when the model you want to
   * include is not available at the time this model is defined. By default this will throw an
   * error if a scope with that name already exists. Pass `override: true` in the options
   * object to silence this error.
   */
  public static addScope<M extends Model>(
    this: ModelStatic<M>,
    scope: FindOptions<M['_attributes']>,
    options?: AddScopeOptions
  ): void;
  public static addScope<M extends Model>(
    this: ModelStatic<M>,
    scope: (
      wrap: (findOptions: FindOptions<M['_attributes']>) => FindOptions<M['_attributes']>,
      ...args: readonly any[]
    ) => FindOptions<M['_attributes']>,
    options?: AddScopeOptions
  ): void;

  /**
   * Search for multiple instances.
   *
   * __Simple search using AND and =__
   * ```js
   * Model.findAll({
   *   where: {
   *     attr1: 42,
   *     attr2: 'cake'
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 = 42 AND attr2 = 'cake'
   * ```
   *
   * __Using greater than, less than etc.__
   * ```js
   *
   * Model.findAll({
   *   where: {
   *     attr1: {
   *       gt: 50
   *     },
   *     attr2: {
   *       lte: 45
   *     },
   *     attr3: {
   *       in: [1,2,3]
   *     },
   *     attr4: {
   *       ne: 5
   *     }
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 > 50 AND attr2 <= 45 AND attr3 IN (1,2,3) AND attr4 != 5
   * ```
   * Possible options are: `[Op.ne], [Op.in], [Op.not], [Op.notIn], [Op.gte], [Op.gt], [Op.lte], [Op.lt], [Op.like], [Op.ilike]/[Op.iLike], [Op.notLike],
   * [Op.notILike], '..'/[Op.between], '!..'/[Op.notBetween], '&&'/[Op.overlap], '@>'/[Op.contains], '<@'/[Op.contained]`
   *
   * __Queries using OR__
   * ```js
   * Model.findAll({
   *   where: Sequelize.and(
   *     { name: 'a project' },
   *     Sequelize.or(
   *       { id: [1,2,3] },
   *       { id: { gt: 10 } }
   *     )
   *   )
   * })
   * ```
   * ```sql
   * WHERE name = 'a project' AND (id` IN (1,2,3) OR id > 10)
   * ```
   *
   * The success listener is called with an array of instances if the query succeeds.
   *
   * @see {Sequelize#query}
   */
  public static findAll<M extends Model>(
    this: ModelStatic<M>,
    options?: FindOptions<M['_attributes']> & { plain?: false }): Promise<RealModel<M>[]>;
  public static findAll<M extends Model>(
    this: ModelStatic<M>,
    options: FindOptions<M['_attributes']> & { plain: true }): Promise<RealModel<M> | null>;


  /**
   * Search for a single instance by its primary key. This applies LIMIT 1, so the listener will
   * always be called with a single instance.
   */
  public static findByPk<M extends Model>(
    this: ModelStatic<M>,
    identifier: Identifier,
    options: Omit<NonNullFindOptions<M['_attributes']>, 'where'>
  ): Promise<RealModel<M>>;
  public static findByPk<M extends Model>(
    this: ModelStatic<M>,
    identifier?: Identifier,
    options?: Omit<FindOptions<M['_attributes']>, 'where'>
  ): Promise<RealModel<M> | null>;

  /**
   * Search for a single instance. Returns the first instance found, or null if none can be found.
   */
  public static findOne<M extends Model>(
    this: ModelStatic<M>,
    options: NonNullFindOptions<M['_attributes']>
  ): Promise<RealModel<M>>;
  public static findOne<M extends Model>(
    this: ModelStatic<M>,
    options?: FindOptions<M['_attributes']>
  ): Promise<RealModel<M> | null>;

  /**
   * Run an aggregation method on the specified field
   *
   * @param field The field to aggregate over. Can be a field name or *
   * @param aggregateFunction The function to use for aggregation, e.g. sum, max etc.
   * @param options Query options. See sequelize.query for full options
   * @return Returns the aggregate result cast to `options.dataType`, unless `options.plain` is false, in
   *     which case the complete data result is returned.
   */
  public static aggregate<T, M extends Model>(
    this: ModelStatic<M>,
    field: keyof M['_attributes'] | '*',
    aggregateFunction: string,
    options?: AggregateOptions<T, M['_attributes']>
  ): Promise<T>;

  /**
   * Count number of records if group by is used
   */
  public static count<M extends Model>(
    this: ModelStatic<M>,
    options: CountWithOptions<M['_attributes']>
  ): Promise<{ [key: string]: number }>;

  /**
   * Count the number of records matching the provided where clause.
   *
   * If you provide an `include` option, the number of matching associations will be counted instead.
   */
  public static count<M extends Model>(
    this: ModelStatic<M>,
    options?: CountOptions<M['_attributes']>
  ): Promise<number>;

  /**
   * Find all the rows matching your query, within a specified offset / limit, and get the total number of
   * rows matching your query. This is very usefull for paging
   *
   * ```js
   * Model.findAndCountAll({
   *   where: ...,
   *   limit: 12,
   *   offset: 12
   * }).then(result => {
   *   ...
   * })
   * ```
   * In the above example, `result.rows` will contain rows 13 through 24, while `result.count` will return
   * the
   * total number of rows that matched your query.
   *
   * When you add includes, only those which are required (either because they have a where clause, or
   * because
   * `required` is explicitly set to true on the include) will be added to the count part.
   *
   * Suppose you want to find all users who have a profile attached:
   * ```js
   * User.findAndCountAll({
   *   include: [
   *      { model: Profile, required: true}
   *   ],
   *   limit: 3
   * });
   * ```
   * Because the include for `Profile` has `required` set it will result in an inner join, and only the users
   * who have a profile will be counted. If we remove `required` from the include, both users with and
   * without
   * profiles will be counted
   */
  public static findAndCountAll<M extends Model>(
    this: ModelStatic<M>,
    options?: FindAndCountOptions<M['_attributes']>
  ): Promise<{ rows: RealModel<M>[]; count: number }>;

  /**
   * Find the maximum value of field
   */
  public static max<T extends DataType | unknown, M extends Model>(
    this: ModelStatic<M>,
    field: keyof M['_attributes'],
    options?: AggregateOptions<T, M['_attributes']>
  ): Promise<T>;

  /**
   * Find the minimum value of field
   */
  public static min<T extends DataType | unknown, M extends Model>(
    this: ModelStatic<M>,
    field: keyof M['_attributes'],
    options?: AggregateOptions<T, M['_attributes']>
  ): Promise<T>;

  /**
   * Find the sum of field
   */
  public static sum<T extends DataType | unknown, M extends Model>(
    this: ModelStatic<M>,
    field: keyof M['_attributes'],
    options?: AggregateOptions<T, M['_attributes']>
  ): Promise<number>;

  /**
   * Builds a new model instance. Values is an object of key value pairs, must be defined but can be empty.
   */
  public static build<M extends Model>(
    this: ModelStatic<M>,
    record?: M['_creationAttributes'],
    options?: BuildOptions
  ): M;

  /**
   * Undocumented bulkBuild
   */
  public static bulkBuild<M extends Model>(
    this: ModelStatic<M>,
    records: ReadonlyArray<M['_creationAttributes']>,
    options?: BuildOptions
  ): M[];

  /**
   * Builds a new model instance and calls save on it.
   */
  public static create<M extends Model>(
    this: ModelStatic<M>,
    values?: M['_creationAttributes'],
    options?: CreateOptions<M['_attributes']>
  ): Promise<RealModel<M>>;
  public static create<M extends Model>(
    this: ModelStatic<M>,
    values: M['_creationAttributes'],
    options: CreateOptions<M['_attributes']> & { returning: false }
  ): Promise<void>;

  /**
   * Find a row that matches the query, or build (but don't save) the row if none is found.
   * The successfull result of the promise will be (instance, initialized) - Make sure to use `.then(([...]))`
   */
  public static findOrBuild<M extends Model>(
    this: ModelStatic<M>,
    options: FindOrCreateOptions<M['_attributes'], M['_creationAttributes']>
  ): Promise<[RealModel<M>, boolean]>;

  /**
   * Find a row that matches the query, or build and save the row if none is found
   * The successful result of the promise will be (instance, created) - Make sure to use `.then(([...]))`
   *
   * If no transaction is passed in the `options` object, a new transaction will be created internally, to
   * prevent the race condition where a matching row is created by another connection after the find but
   * before the insert call. However, it is not always possible to handle this case in SQLite, specifically
   * if one transaction inserts and another tries to select before the first one has comitted. In this case,
   * an instance of sequelize.TimeoutError will be thrown instead. If a transaction is created, a savepoint
   * will be created instead, and any unique constraint violation will be handled internally.
   */
  public static findOrCreate<M extends Model>(
    this: ModelStatic<M>,
    options: FindOrCreateOptions<M['_attributes'], M['_creationAttributes']>
  ): Promise<[RealModel<M>, boolean]>;

  /**
   * A more performant findOrCreate that will not work under a transaction (at least not in postgres)
   * Will execute a find call, if empty then attempt to create, if unique constraint then attempt to find again
   */
  public static findCreateFind<M extends Model>(
    this: ModelStatic<M>,
    options: FindOrCreateOptions<M['_attributes'], M['_creationAttributes']>
  ): Promise<[RealModel<M>, boolean]>;

  /**
   * Insert or update a single row. An update will be executed if a row which matches the supplied values on
   * either the primary key or a unique key is found. Note that the unique index must be defined in your
   * sequelize model and not just in the table. Otherwise you may experience a unique constraint violation,
   * because sequelize fails to identify the row that should be updated.
   *
   * **Implementation details:**
   *
   * * MySQL - Implemented as a single query `INSERT values ON DUPLICATE KEY UPDATE values`
   * * PostgreSQL - Implemented as a temporary function with exception handling: INSERT EXCEPTION WHEN
   *   unique_constraint UPDATE
   * * SQLite - Implemented as two queries `INSERT; UPDATE`. This means that the update is executed
   * regardless
   *   of whether the row already existed or not
   *
   * **Note** that SQLite returns null for created, no matter if the row was created or updated. This is
   * because SQLite always runs INSERT OR IGNORE + UPDATE, in a single query, so there is no way to know
   * whether the row was inserted or not.
   */
  public static upsert<M extends Model>(
    this: ModelStatic<M>,
    values: M['_creationAttributes'],
    options?: UpsertOptions<M['_attributes']>
  ): Promise<[RealModel<M>, boolean | null]>;

  /**
   * Create and insert multiple instances in bulk.
   *
   * The success handler is passed an array of instances, but please notice that these may not completely
   * represent the state of the rows in the DB. This is because MySQL and SQLite do not make it easy to
   * obtain
   * back automatically generated IDs and other default values in a way that can be mapped to multiple
   * records. To obtain Instances for the newly created values, you will need to query for them again.
   *
   * @param records List of objects (key/value pairs) to create instances from
   */
  public static bulkCreate<M extends Model>(
    this: ModelStatic<M>,
    records: ReadonlyArray<M['_creationAttributes']>,
    options?: BulkCreateOptions<M['_attributes']>
  ): Promise<RealModel<M>[]>;

  /**
   * Truncate all instances of the model. This is a convenient method for Model.destroy({ truncate: true }).
   */
  public static truncate<M extends Model>(
    this: ModelStatic<M>,
    options?: TruncateOptions<M['_attributes']>
  ): Promise<void>;

  /**
   * Delete multiple instances, or set their deletedAt timestamp to the current time if `paranoid` is enabled.
   *
   * @return Promise<number> The number of destroyed rows
   */
  public static destroy<M extends Model>(
    this: ModelStatic<M>,
    options?: DestroyOptions<M['_attributes']>
  ): Promise<number>;

  /**
   * Restore multiple instances if `paranoid` is enabled.
   */
  public static restore<M extends Model>(
    this: ModelStatic<M>,
    options?: RestoreOptions<M['_attributes']>
  ): Promise<void>;

  /**
   * Update multiple instances that match the where options. The promise returns an array with one or two
   * elements. The first element is always the number of affected rows, while the second element is the actual
   * affected rows (only supported in postgres and mssql with `options.returning` true.)
   */
  public static update<M extends Model>(
    this: ModelStatic<M>,
    values: Partial<M['_attributes']>,
    options: UpdateOptions<M['_attributes']>
  ): Promise<[number, M[]]>;

  /**
   * Increments a single field.
   */
  public static increment<M extends Model>(
    this: ModelStatic<M>,
    field: keyof M['_attributes'],
    options: IncrementDecrementOptionsWithBy<M['_attributes']>
  ): Promise<RealModel<M>>;

  /**
   * Increments multiple fields by the same value.
   */
  public static increment<M extends Model>(
    this: ModelStatic<M>,
    fields: ReadonlyArray<keyof M['_attributes']>,
    options: IncrementDecrementOptionsWithBy<M['_attributes']>
  ): Promise<RealModel<M>>;

  /**
   * Increments multiple fields by different values.
   */
  public static increment<M extends Model>(
    this: ModelStatic<M>,
    fields: { [key in keyof M['_attributes']]?: number },
    options: IncrementDecrementOptions<M['_attributes']>
  ): Promise<RealModel<M>>;

  /**
   * Run a describe query on the table. The result will be return to the listener as a hash of attributes and
   * their types.
   */
  public static describe(): Promise<object>;

  /**
   * Unscope the model
   */
  public static unscoped<M extends ModelType>(this: M): M;

  /**
   * A hook that is run before validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static beforeValidate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: ValidationOptions) => HookReturn
  ): void;
  public static beforeValidate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: ValidationOptions) => HookReturn
  ): void;

  /**
   * A hook that is run after validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static afterValidate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: ValidationOptions) => HookReturn
  ): void;
  public static afterValidate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: ValidationOptions) => HookReturn
  ): void;

  /**
   * A hook that is run before creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  public static beforeCreate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: CreateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeCreate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: CreateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run after creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  public static afterCreate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: CreateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static afterCreate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: CreateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static beforeDestroy<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: InstanceDestroyOptions) => HookReturn
  ): void;
  public static beforeDestroy<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: InstanceDestroyOptions) => HookReturn
  ): void;

  /**
   * A hook that is run after destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static afterDestroy<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: InstanceDestroyOptions) => HookReturn
  ): void;
  public static afterDestroy<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: InstanceDestroyOptions) => HookReturn
  ): void;

  /**
   * A hook that is run before updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static beforeUpdate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeUpdate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run after updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static afterUpdate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static afterUpdate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before creating or updating a single instance, It proxies `beforeCreate` and `beforeUpdate`
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static beforeSave<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: UpdateOptions<M['_attributes']> | SaveOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeSave<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: UpdateOptions<M['_attributes']> | SaveOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run after creating or updating a single instance, It proxies `afterCreate` and `afterUpdate`
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  public static afterSave<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instance: M, options: UpdateOptions<M['_attributes']> | SaveOptions<M['_attributes']>) => HookReturn
  ): void;
  public static afterSave<M extends Model>(
    this: ModelStatic<M>,
    fn: (instance: M, options: UpdateOptions<M['_attributes']> | SaveOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  public static beforeBulkCreate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instances: M[], options: BulkCreateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeBulkCreate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instances: M[], options: BulkCreateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run after creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  public static afterBulkCreate<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instances: readonly M[], options: BulkCreateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static afterBulkCreate<M extends Model>(
    this: ModelStatic<M>,
    fn: (instances: readonly M[], options: BulkCreateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static beforeBulkDestroy<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: BulkCreateOptions<M['_attributes']>) => HookReturn): void;
  public static beforeBulkDestroy<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: BulkCreateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run after destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static afterBulkDestroy<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: DestroyOptions<M['_attributes']>) => HookReturn
  ): void;
  public static afterBulkDestroy<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: DestroyOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static beforeBulkUpdate<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeBulkUpdate<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static afterBulkUpdate<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;
  public static afterBulkUpdate<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: UpdateOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static beforeFind<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: FindOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeFind<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: FindOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before a count query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static beforeCount<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: CountOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeCount<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: CountOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static beforeFindAfterExpandIncludeAll<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: FindOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeFindAfterExpandIncludeAll<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: FindOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before a find (select) query, after all option parsing is complete
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  public static beforeFindAfterOptions<M extends Model>(
    this: ModelStatic<M>,
    name: string, fn: (options: FindOptions<M['_attributes']>) => HookReturn
  ): void;
  public static beforeFindAfterOptions<M extends Model>(
    this: ModelStatic<M>,
    fn: (options: FindOptions<M['_attributes']>) => void
  ): HookReturn;

  /**
   * A hook that is run after a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with instance(s), options
   */
  public static afterFind<M extends Model>(
    this: ModelStatic<M>,
    name: string,
    fn: (instancesOrInstance: readonly M[] | M | null, options: FindOptions<M['_attributes']>) => HookReturn
  ): void;
  public static afterFind<M extends Model>(
    this: ModelStatic<M>,
    fn: (instancesOrInstance: readonly M[] | M | null, options: FindOptions<M['_attributes']>) => HookReturn
  ): void;

  /**
   * A hook that is run before sequelize.sync call
   * @param fn   A callback function that is called with options passed to sequelize.sync
   */
  public static beforeBulkSync(name: string, fn: (options: SyncOptions) => HookReturn): void;
  public static beforeBulkSync(fn: (options: SyncOptions) => HookReturn): void;

  /**
   * A hook that is run after sequelize.sync call
   * @param fn   A callback function that is called with options passed to sequelize.sync
   */
  public static afterBulkSync(name: string, fn: (options: SyncOptions) => HookReturn): void;
  public static afterBulkSync(fn: (options: SyncOptions) => HookReturn): void;

  /**
   * A hook that is run before Model.sync call
   * @param fn   A callback function that is called with options passed to Model.sync
   */
  public static beforeSync(name: string, fn: (options: SyncOptions) => HookReturn): void;
  public static beforeSync(fn: (options: SyncOptions) => HookReturn): void;

  /**
   * A hook that is run after Model.sync call
   * @param fn   A callback function that is called with options passed to Model.sync
   */
  public static afterSync(name: string, fn: (options: SyncOptions) => HookReturn): void;
  public static afterSync(fn: (options: SyncOptions) => HookReturn): void;

  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added
   * on the target.
   *
   * Example: `User.hasOne(Profile)`. This will add userId to the profile table.
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  public static hasOne<M extends Model, T extends Model>(
    this: ModelStatic<M>, target: ModelStatic<T>, options?: HasOneOptions<M, T>
  ): HasOne<M, T>;

  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added on the
   * source.
   *
   * Example: `Profile.belongsTo(User)`. This will add userId to the profile table.
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  public static belongsTo<M extends Model, T extends Model>(
    this: ModelStatic<M>, target: ModelStatic<T>, options?: BelongsToOptions<M, T>
  ): BelongsTo<M, T>;

  /**
   * Create an association that is either 1:m or n:m.
   *
   * ```js
   * // Create a 1:m association between user and project
   * User.hasMany(Project)
   * ```
   * ```js
   * // Create a n:m association between user and project
   * User.hasMany(Project)
   * Project.hasMany(User)
   * ```
   * By default, the name of the join table will be source+target, so in this case projectsusers. This can be
   * overridden by providing either a string or a Model as `through` in the options. If you use a through
   * model with custom attributes, these attributes can be set when adding / setting new associations in two
   * ways. Consider users and projects from before with a join table that stores whether the project has been
   * started yet:
   * ```js
   * class UserProjects extends Model {}
   * UserProjects.init({
   *   started: Sequelize.BOOLEAN
   * }, { sequelize })
   * User.hasMany(Project, { through: UserProjects })
   * Project.hasMany(User, { through: UserProjects })
   * ```
   * ```js
   * jan.addProject(homework, { started: false }) // The homework project is not started yet
   * jan.setProjects([makedinner, doshopping], { started: true}) // Both shopping and dinner have been
   * started
   * ```
   *
   * If you want to set several target instances, but with different attributes you have to set the
   * attributes on the instance, using a property with the name of the through model:
   *
   * ```js
   * p1.userprojects {
   *   started: true
   * }
   * user.setProjects([p1, p2], {started: false}) // The default value is false, but p1 overrides that.
   * ```
   *
   * Similarily, when fetching through a join table with custom attributes, these attributes will be
   * available as an object with the name of the through model.
   * ```js
   * user.getProjects().then(projects => {
   *   const p1 = projects[0]
   *   p1.userprojects.started // Is this project started yet?
   * })
   * ```
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  public static hasMany<M extends Model, T extends Model>(
    this: ModelStatic<M>, target: ModelStatic<T>, options?: Omit<HasManyOptions<M, T>, 'as'>
  ): HasMany<M, T>;

  /**
   * Create an N:M association with a join table
   *
   * ```js
   * User.belongsToMany(Project)
   * Project.belongsToMany(User)
   * ```
   * By default, the name of the join table will be source+target, so in this case projectsusers. This can be
   * overridden by providing either a string or a Model as `through` in the options.
   *
   * If you use a through model with custom attributes, these attributes can be set when adding / setting new
   * associations in two ways. Consider users and projects from before with a join table that stores whether
   * the project has been started yet:
   * ```js
   * class UserProjects extends Model {}
   * UserProjects.init({
   *   started: Sequelize.BOOLEAN
   * }, { sequelize });
   * User.belongsToMany(Project, { through: UserProjects })
   * Project.belongsToMany(User, { through: UserProjects })
   * ```
   * ```js
   * jan.addProject(homework, { started: false }) // The homework project is not started yet
   * jan.setProjects([makedinner, doshopping], { started: true}) // Both shopping and dinner has been started
   * ```
   *
   * If you want to set several target instances, but with different attributes you have to set the
   * attributes on the instance, using a property with the name of the through model:
   *
   * ```js
   * p1.userprojects {
   *   started: true
   * }
   * user.setProjects([p1, p2], {started: false}) // The default value is false, but p1 overrides that.
   * ```
   *
   * Similarily, when fetching through a join table with custom attributes, these attributes will be
   * available as an object with the name of the through model.
   * ```js
   * user.getProjects().then(projects => {
   *   const p1 = projects[0]
   *   p1.userprojects.started // Is this project started yet?
   * })
   * ```
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   *
   */
  public static belongsToMany<M extends Model, T extends Model, P extends Model>(
    this: ModelStatic<M>, target: ModelStatic<T>, options: BelongsToManyOptions<M, T, P>
  ): BelongsToMany<M, T>;

  /**
   * Returns true if this instance has not yet been persisted to the database
   */
  public isNewRecord: boolean;

  /**
   * A reference to the sequelize instance
   */
  public sequelize: Sequelize;

  /**
   * Builds a new model instance.
   * @param values an object of key value pairs
   */
  constructor(values?: TCreationAttributes, options?: BuildOptions);

  /**
   * Get an object representing the query for this instance, use with `options.where`
   */
  public where(): object;

  /**
   * Get the value of the underlying data value
   */
  public getDataValue<K extends keyof TModelAttributes>(key: K): TModelAttributes[K];

  /**
   * Update the underlying data value
   */
  public setDataValue<K extends keyof TModelAttributes>(key: K, value: TModelAttributes[K]): void;

  /**
   * If no key is given, returns all values of the instance, also invoking virtual getters.
   *
   * If key is given and a field or virtual getter is present for the key it will call that getter - else it
   * will return the value for key.
   *
   * @param options.plain If set to true, included instances will be returned as plain objects
   */
  public get(options: { plain: true; clone?: boolean }): TModelAttributes & {
    [K in keyof Assocs]: AssociationToObject<Assocs[K]>;
  };
  public get(options?: { plain?: false; clone?: boolean }): TModelAttributes & AssociationToModels<Assocs>;
  public get<K extends keyof TModelAttributes>(key: K, options?: { plain?: boolean; clone?: boolean }): TModelAttributes[K];
  public get<K extends keyof Assocs>(key: K, options: { plain: true; clone?: boolean }): AssociationToObject<Assocs[K]>;
  public get<K extends keyof Assocs>(key: K, options?: { plain?: false; clone?: boolean }): AssociationToModel<Assocs[K]>;
  public get(key: string, options?: { plain?: boolean; clone?: boolean }): unknown;

  /**
   * Set is used to update values on the instance (the sequelize representation of the instance that is,
   * remember that nothing will be persisted before you actually call `save`). In its most basic form `set`
   * will update a value stored in the underlying `dataValues` object. However, if a custom setter function
   * is defined for the key, that function will be called instead. To bypass the setter, you can pass `raw:
   * true` in the options object.
   *
   * If set is called with an object, it will loop over the object, and call set recursively for each key,
   * value pair. If you set raw to true, the underlying dataValues will either be set directly to the object
   * passed, or used to extend dataValues, if dataValues already contain values.
   *
   * When set is called, the previous value of the field is stored and sets a changed flag(see `changed`).
   *
   * Set can also be used to build instances for associations, if you have values for those.
   * When using set with associations you need to make sure the property key matches the alias of the
   * association while also making sure that the proper include options have been set (from .build() or
   * .findOne())
   *
   * If called with a dot.seperated key on a JSON/JSONB attribute it will set the value nested and flag the
   * entire object as changed.
   *
   * @param options.raw If set to true, field and virtual setters will be ignored
   * @param options.reset Clear all previously set data values
   */
  public set<K extends keyof TModelAttributes>(key: K, value: TModelAttributes[K], options?: SetOptions): this;
  public set(keys: Partial<TModelAttributes>, options?: SetOptions): this;
  public setAttributes<K extends keyof TModelAttributes>(key: K, value: TModelAttributes[K], options?: SetOptions): this;
  public setAttributes(keys: Partial<TModelAttributes>, options?: SetOptions): this;

  /**
   * If changed is called with a string it will return a boolean indicating whether the value of that key in
   * `dataValues` is different from the value in `_previousDataValues`.
   *
   * If changed is called without an argument, it will return an array of keys that have changed.
   *
   * If changed is called with two arguments, it will set the property to `dirty`.
   *
   * If changed is called without an argument and no keys have changed, it will return `false`.
   */
  public changed<K extends keyof TModelAttributes>(key: K): boolean;
  public changed<K extends keyof TModelAttributes>(key: K, dirty: boolean): void;
  public changed(): false | string[];

  /**
   * Returns the previous value for key from `_previousDataValues`.
   */
  public previous(): Partial<TCreationAttributes>;
  public previous<K extends keyof TCreationAttributes>(key: K): TCreationAttributes[K] | undefined;

  /**
   * Validates this instance, and if the validation passes, persists it to the database.
   *
   * Returns a Promise that resolves to the saved instance (or rejects with a `Sequelize.ValidationError`, which will have a property for each of the fields for which the validation failed, with the error message for that field).
   *
   * This method is optimized to perform an UPDATE only into the fields that changed. If nothing has changed, no SQL query will be performed.
   *
   * This method is not aware of eager loaded associations. In other words, if some other model instance (child) was eager loaded with this instance (parent), and you change something in the child, calling `save()` will simply ignore the change that happened on the child.
   */
  public save(options?: SaveOptions<TModelAttributes>): Promise<this>;

  /**
   * Refresh the current instance in-place, i.e. update the object with current data from the DB and return
   * the same object. This is different from doing a `find(Instance.id)`, because that would create and
   * return a new instance. With this method, all references to the Instance are updated with the new data
   * and no new objects are created.
   */
  public reload(options?: FindOptions<TModelAttributes>): Promise<this>;

  /**
   * Validate the attribute of this instance according to validation rules set in the model definition.
   *
   * Emits null if and only if validation successful; otherwise an Error instance containing
   * { field name : [error msgs] } entries.
   *
   * @param options.skip An array of strings. All properties that are in this array will not be validated
   */
  public validate(options?: ValidationOptions): Promise<void>;

  /**
   * This is the same as calling `set` and then calling `save`.
   */
  public update<K extends Partial<TModelAttributes>>(keys: K, options?: InstanceUpdateOptions<TModelAttributes>): Promise<this>;
  public update<K extends string & keyof TModelAttributes>(key: K, value: TModelAttributes[K], options?: InstanceUpdateOptions<TModelAttributes>): Promise<this>;

  /**
   * Destroy the row corresponding to this instance. Depending on your setting for paranoid, the row will
   * either be completely deleted, or have its deletedAt timestamp set to the current time.
   */
  public destroy(options?: InstanceDestroyOptions): Promise<void>;

  /**
   * Restore the row corresponding to this instance. Only available for paranoid models.
   */
  public restore(options?: InstanceRestoreOptions): Promise<void>;

  /**
   * Increment the value of one or more columns. This is done in the database, which means it does not use
   * the values currently stored on the Instance. The increment is done using a
   * ```sql
   * SET column = column + X
   * ```
   * query. To get the correct value after an increment into the Instance you should do a reload.
   *
   * ```js
   * instance.increment('number') // increment number by 1
   * instance.increment(['number', 'count'], { by: 2 }) // increment number and count by 2
   * instance.increment({ answer: 42, tries: 1}, { by: 2 }) // increment answer by 42, and tries by 1.
   *                                                        // `by` is ignored, since each column has its own
   *                                                        // value
   * ```
   *
   * @param fields If a string is provided, that column is incremented by the value of `by` given in options.
   *               If an array is provided, the same is true for each column.
   *               If and object is provided, each column is incremented by the value given.
   */
  public increment<K extends keyof TModelAttributes>(
    fields: K | readonly K[] | Partial<TModelAttributes>,
    options?: IncrementDecrementOptionsWithBy<TModelAttributes>
  ): Promise<this>;

  /**
   * Decrement the value of one or more columns. This is done in the database, which means it does not use
   * the values currently stored on the Instance. The decrement is done using a
   * ```sql
   * SET column = column - X
   * ```
   * query. To get the correct value after an decrement into the Instance you should do a reload.
   *
   * ```js
   * instance.decrement('number') // decrement number by 1
   * instance.decrement(['number', 'count'], { by: 2 }) // decrement number and count by 2
   * instance.decrement({ answer: 42, tries: 1}, { by: 2 }) // decrement answer by 42, and tries by 1.
   *                                                        // `by` is ignored, since each column has its own
   *                                                        // value
   * ```
   *
   * @param fields If a string is provided, that column is decremented by the value of `by` given in options.
   *               If an array is provided, the same is true for each column.
   *               If and object is provided, each column is decremented by the value given
   */
  public decrement<K extends keyof TModelAttributes>(
    fields: K | readonly K[] | Partial<TModelAttributes>,
    options?: IncrementDecrementOptionsWithBy<TModelAttributes>
  ): Promise<this>;

  /**
   * Check whether all values of this and `other` Instance are the same
   */
  public equals(other: this): boolean;

  /**
   * Check if this is equal to one of `others` by calling equals
   */
  public equalsOneOf(others: readonly this[]): boolean;

  /**
   * Convert the instance to a JSON representation. Proxies to calling `get` with no keys. This means get all
   * values gotten from the DB, and apply all custom getters.
   */
  public toJSON(): object;

  /**
   * Helper method to determine if a instance is "soft deleted". This is
   * particularly useful if the implementer renamed the deletedAt attribute to
   * something different. This method requires paranoid to be enabled.
   *
   * Throws an error if paranoid is not enabled.
   */
  public isSoftDeleted(): boolean;
}
