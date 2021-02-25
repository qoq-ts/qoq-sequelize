import { QueryInterfaceOptions, QueryInterfaceDropAllTablesOptions, QueryOptions, QueryInterfaceCreateTableOptions, QueryInterfaceDropTableOptions, Logging, QueryInterfaceIndexOptions, WhereOptions, QueryOptionsWithWhere, FunctionParam, QueryOptionsWithForce, Transaction, CreateDatabaseOptions, AddConstraintOptions, ColumnsDescription, TableName } from 'sequelize';
import { Sequelize } from '../../model/Sequelize';
import { AdvancedColumn } from '../../columns/AdvancedColumn';
import { Model } from './Model';
import { SetRequired } from 'sequelize/types/type-helpers/set-required';

/**
* The interface that Sequelize uses to talk to all databases.
*
* This interface is available through sequelize.queryInterface. It should not be commonly used, but it's
* referenced anyway, so it can be used.
*/
export class QueryInterface {
  /**
   * Returns the dialect-specific sql generator.
   *
   * We don't have a definition for the QueryGenerator, because I doubt it is commonly in use separately.
   */
  public QueryGenerator: unknown;

  /**
   * Returns the current sequelize instance.
   */
  public sequelize: Sequelize;

  constructor(sequelize: Sequelize);

  /**
   * Queries the schema (table list).
   *
   * @param schema The schema to query. Applies only to Postgres.
   */
  public createSchema(schema?: string, options?: QueryInterfaceOptions): Promise<void>;

  /**
   * Drops the specified schema (table).
   *
   * @param schema The schema to query. Applies only to Postgres.
   */
  public dropSchema(schema?: string, options?: QueryInterfaceOptions): Promise<void>;

  /**
   * Drops all tables.
   */
  public dropAllSchemas(options?: QueryInterfaceDropAllTablesOptions): Promise<void>;

  /**
   * Queries all table names in the database.
   *
   * @param options
   */
  public showAllSchemas(options?: QueryOptions): Promise<object>;

  /**
   * Return database version
   */
  public databaseVersion(options?: QueryInterfaceOptions): Promise<string>;

  /**
   * Creates a table with specified attributes.
   *
   * @param tableName     Name of table to create
   * @param attributes    Hash of attributes, key is attribute name, value is data type
   * @param options       Table options.
   */
  public createTable(
    tableName: string | { schema?: string; tableName?: string },
    attributes: Record<string, AdvancedColumn>,
    options?: QueryInterfaceCreateTableOptions
  ): Promise<void>;

  /**
   * Drops the specified table.
   *
   * @param tableName Table name.
   * @param options   Query options, particularly "force".
   */
  public dropTable(tableName: string, options?: QueryInterfaceDropTableOptions): Promise<void>;

  /**
   * Drops all tables.
   *
   * @param options
   */
  public dropAllTables(options?: QueryInterfaceDropAllTablesOptions): Promise<void>;

  /**
   * Drops all defined enums
   *
   * @param options
   */
  public dropAllEnums(options?: QueryOptions): Promise<void>;

  /**
   * Renames a table
   */
  public renameTable(before: string, after: string, options?: QueryInterfaceOptions): Promise<void>;

  /**
   * Returns all tables
   */
  public showAllTables(options?: QueryOptions): Promise<string[]>;

  /**
   * Describe a table
   */
  public describeTable(
    tableName: string | { schema?: string; tableName?: string },
    options?: string | { schema?: string; schemaDelimiter?: string } & Logging
  ): Promise<ColumnsDescription>;

  /**
   * Adds a new column to a table
   */
  public addColumn(
    table: string | { schema?: string; tableName?: string },
    key: string,
    attribute: AdvancedColumn,
    options?: QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Removes a column from a table
   */
  public removeColumn(
    table: string | { schema?: string; tableName?: string },
    attribute: string,
    options?: QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Changes a column
   */
  public changeColumn(
    tableName: string | { schema?: string; tableName?: string },
    attributeName: string,
    dataTypeOrOptions: AdvancedColumn,
    options?: QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Renames a column
   */
  public renameColumn(
    tableName: string | { schema?: string; tableName?: string },
    attrNameBefore: string,
    attrNameAfter: string,
    options?: QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Adds a new index to a table
   */
  public addIndex(
    tableName: string,
    attributes: string[],
    options?: QueryInterfaceIndexOptions,
    rawTablename?: string
  ): Promise<void>;
  public addIndex(
    tableName: string,
    options: SetRequired<QueryInterfaceIndexOptions, 'fields'>,
    rawTablename?: string
  ): Promise<void>;

  /**
   * Removes an index of a table
   */
  public removeIndex(tableName: string, indexName: string, options?: QueryInterfaceIndexOptions): Promise<void>;
  public removeIndex(tableName: string, attributes: string[], options?: QueryInterfaceIndexOptions): Promise<void>;

  /**
   * Adds constraints to a table
   */
  public addConstraint(
    tableName: string,
    options?: AddConstraintOptions & QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Removes constraints from a table
   */
  public removeConstraint(tableName: string, constraintName: string, options?: QueryInterfaceOptions): Promise<void>;

  /**
   * Shows the index of a table
   */
  public showIndex(tableName: string | object, options?: QueryOptions): Promise<object>;

  /**
   * Put a name to an index
   */
  public nameIndexes(indexes: string[], rawTablename: string): Promise<void>;

  /**
   * Returns all foreign key constraints of requested tables
   */
  public getForeignKeysForTables(tableNames: string[], options?: QueryInterfaceOptions): Promise<object>;

  /**
   * Get foreign key references details for the table
   */
  public getForeignKeyReferencesForTable(tableName: string, options?: QueryInterfaceOptions): Promise<object>;

  /**
   * Inserts a new record
   */
  public insert(instance: Model | null, tableName: string, values: object, options?: QueryOptions): Promise<object>;

  /**
   * Inserts or Updates a record in the database
   */
  public upsert(
    tableName: TableName,
    insertValues: object,
    updateValues: object,
    where: object,
    model: typeof Model,
    options?: QueryOptions
  ): Promise<object>;

  /**
   * Inserts multiple records at once
   */
  public bulkInsert(
    tableName: TableName,
    records: object[],
    options?: QueryOptions,
    attributes?: string[] | string
  ): Promise<object | number>;

  /**
   * Updates a row
   */
  public update<M extends Model>(
    instance: M,
    tableName: TableName,
    values: object,
    identifier: WhereOptions<M['_attributes']>,
    options?: QueryOptions
  ): Promise<object>;

  /**
   * Updates multiple rows at once
   */
  public bulkUpdate(
    tableName: TableName,
    values: object,
    identifier: WhereOptions<any>,
    options?: QueryOptions,
    attributes?: string[] | string
  ): Promise<object>;

  /**
   * Deletes a row
   */
  public delete(
    instance: Model | null,
    tableName: TableName,
    identifier: WhereOptions<any>,
    options?: QueryOptions
  ): Promise<object>;

  /**
   * Deletes multiple rows at once
   */
  public bulkDelete(
    tableName: TableName,
    identifier: WhereOptions<any>,
    options?: QueryOptions,
    model?: typeof Model
  ): Promise<object>;

  /**
   * Returns selected rows
   */
  public select(model: typeof Model | null, tableName: TableName, options?: QueryOptionsWithWhere): Promise<object[]>;

  /**
   * Increments a row value
   */
  public increment<M extends Model>(
    instance: Model,
    tableName: TableName,
    values: object,
    identifier: WhereOptions<M['_attributes']>,
    options?: QueryOptions
  ): Promise<object>;

  /**
   * Selects raw without parsing the string into an object
   */
  public rawSelect(
    tableName: TableName,
    options: QueryOptionsWithWhere,
    attributeSelector: string | string[],
    model?: typeof Model
  ): Promise<string[]>;

  /**
   * Postgres only. Creates a trigger on specified table to call the specified function with supplied
   * parameters.
   */
  public createTrigger(
    tableName: TableName,
    triggerName: string,
    timingType: string,
    fireOnArray: {
      [key: string]: unknown;
    }[],
    functionName: string,
    functionParams: FunctionParam[],
    optionsArray: string[],
    options?: QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Postgres only. Drops the specified trigger.
   */
  public dropTrigger(tableName: TableName, triggerName: string, options?: QueryInterfaceOptions): Promise<void>;

  /**
   * Postgres only. Renames a trigger
   */
  public renameTrigger(
    tableName: TableName,
    oldTriggerName: string,
    newTriggerName: string,
    options?: QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Postgres only. Create a function
   */
  public createFunction(
    functionName: string,
    params: FunctionParam[],
    returnType: string,
    language: string,
    body: string,
    optionsArray?: string[],
    options?: QueryOptionsWithForce
  ): Promise<void>;

  /**
   * Postgres only. Drops a function
   */
  public dropFunction(functionName: string, params: FunctionParam[], options?: QueryInterfaceOptions): Promise<void>;

  /**
   * Postgres only. Rename a function
   */
  public renameFunction(
    oldFunctionName: string,
    params: FunctionParam[],
    newFunctionName: string,
    options?: QueryInterfaceOptions
  ): Promise<void>;

  /**
   * Escape an identifier (e.g. a table or attribute name). If force is true, the identifier will be quoted
   * even if the `quoteIdentifiers` option is false.
   */
  public quoteIdentifier(identifier: string, force: boolean): string;

  /**
   * Escape a table name
   */
  public quoteTable(identifier: TableName): string;

  /**
   * Split an identifier into .-separated tokens and quote each part. If force is true, the identifier will be
   * quoted even if the `quoteIdentifiers` option is false.
   */
  public quoteIdentifiers(identifiers: string, force: boolean): string;

  /**
   * Escape a value (e.g. a string, number or date)
   */
  public escape(value?: string | number | Date): string;

  /**
   * Set option for autocommit of a transaction
   */
  public setAutocommit(transaction: Transaction, value: boolean, options?: QueryOptions): Promise<void>;

  /**
   * Set the isolation level of a transaction
   */
  public setIsolationLevel(transaction: Transaction, value: string, options?: QueryOptions): Promise<void>;

  /**
   * Begin a new transaction
   */
  public startTransaction(transaction: Transaction, options?: QueryOptions): Promise<void>;

  /**
   * Defer constraints
   */
  public deferConstraints(transaction: Transaction, options?: QueryOptions): Promise<void>;

  /**
   * Commit an already started transaction
   */
  public commitTransaction(transaction: Transaction, options?: QueryOptions): Promise<void>;

  /**
   * Rollback ( revert ) a transaction that has'nt been commited
   */
  public rollbackTransaction(transaction: Transaction, options?: QueryOptions): Promise<void>;

  /**
   * Creates a database
   */
  public createDatabase(name: string, options?: CreateDatabaseOptions): Promise<void>;

  /**
   * Creates a database
   */
  public dropDatabase(name: string, options?: QueryOptions): Promise<void>;
}
