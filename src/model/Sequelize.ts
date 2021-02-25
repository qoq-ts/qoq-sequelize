import path, { join } from 'path';
import glob from 'glob';
import { Model, ModelAttributes, ModelCtor, ModelOptions, Options, QueryInterfaceCreateTableOptions, Sequelize as OriginSequelize, QueryInterface as OriginQueryInterface, QueryInterfaceOptions } from 'sequelize';
import { topic } from '../util/topic';
import { TemporaryModel } from './TemporaryModel';
import { ConsoleApplication } from 'qoq';
import { AdvancedColumn } from '../columns/AdvancedColumn';
import { getFinalDataType } from '../util/getFinalDataType';
import { QueryInterface } from '../types/override/QueryInterface';

export interface SequelizeOptions extends Options {
  modelsPath?: string;
  migrationsPath?: string;
  seedersPath?: string;
}

export class Sequelize extends OriginSequelize {
  protected readonly modelsPath: string;
  public/*protected*/ readonly migrationsPath: string;
  public/*protected*/ readonly seedersPath: string;

  constructor(options: SequelizeOptions = {}) {
    super(options);

    this.modelsPath = options.modelsPath || './src/models';
    this.migrationsPath = options.migrationsPath || './src/migrations';
    this.seedersPath = options.seedersPath || './src/seeders';

    this.updateQueryInterface();
    this.parseModels(this.modelsPath);
    topic.publish('modelsInitialized');
  }

  /**
   * @deprecated
   * Use defineModel instead.
   *
   * ```javascript
   * import { defineModel, column } from 'qoq-sequelize';
   *
   * export const User = defineModel({
   *   attributes: {
   *     id: column.int.primaryKey(),
   *     name: column.varChar.notNull().comment('User Name'),
   *   },
   * });
   * ```
   */
  public define<M extends Model, TCreationAttributes = M['_attributes']>(
    modelName: string,
    attributes: ModelAttributes<M, TCreationAttributes>,
    options?: ModelOptions
  ): ModelCtor<M> {
    return super.define(modelName, attributes, options);
  }

  /** @ts-expect-error */
  public getQueryInterface(): QueryInterface {
    // @ts-expect-error
    return super.getQueryInterface();
  }

  mountCommands(app: ConsoleApplication) {
    app.mountRouter(join(__dirname + '..', 'commands'));
    topic.publish('sequelizeShared', this);
  }

  protected parseModels(modelsPath: string) {
    glob.sync(path.resolve(modelsPath, '**/!(*.d).{ts,js}')).forEach((fileName) => {
      const modules = require(fileName);

      for (const [key, model] of Object.entries(modules)) {
        if (model && model instanceof TemporaryModel) {
          model.updateModelName(key);
          modules[key] = model.define(this);
        }
      }
    });
  }

  protected updateQueryInterface() {
    const queryInferface = this.getQueryInterface();
    const { createTable, addColumn, changeColumn } = queryInferface as unknown as OriginQueryInterface;

    queryInferface.createTable = function (
      tableName: string | { schema?: string; tableName?: string },
      attributes: Record<string, AdvancedColumn>,
      options?: QueryInterfaceCreateTableOptions
    ): Promise<void> {
      const attrs: ModelAttributes = {};

      for (const [attribute, definition] of Object.entries(attributes)) {
        attrs[attribute] = getFinalDataType(definition);
      }

      return createTable(tableName, attrs, options);
    };

    queryInferface.addColumn = function (
      table: string | { schema?: string; tableName?: string },
      key: string,
      attribute: AdvancedColumn,
      options?: QueryInterfaceOptions
    ): Promise<void> {
      return addColumn(table, key, getFinalDataType(attribute), options);
    }

    queryInferface.changeColumn = function (
      tableName: string | { schema?: string; tableName?: string },
      attributeName: string,
      dataTypeOrOptions: AdvancedColumn,
      options?: QueryInterfaceOptions
    ): Promise<void> {
      return changeColumn(tableName, attributeName, getFinalDataType(dataTypeOrOptions), options);
    }
  }
}
