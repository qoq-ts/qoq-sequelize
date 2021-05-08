import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Model, ModelAttributes, ModelCtor, ModelOptions, Options, QueryInterfaceCreateTableOptions, Sequelize as OriginSequelize, QueryInterface as OriginQueryInterface, QueryInterfaceOptions } from 'sequelize';
import { topic } from '../util/topic';
import { ConsoleApplication, finder } from 'qoq';
import { AdvancedColumn } from '../columns/AdvancedColumn';
import { getFinalDataType } from '../util/getFinalDataType';
import { QueryInterface } from '../types/override/QueryInterface';
import { TemporaryModel } from './TemporaryModel';

export interface SequelizeOptions extends Options {
  modelsDir?: string;
  migrationsDir?: string;
  seedersDir?: string;
  migrationStorageTableName?: string;
}

export class Sequelize extends OriginSequelize {
  protected readonly modelsPath: string;
  public/*protected*/ readonly migrationsPath: string;
  public/*protected*/ readonly seedersPath: string;
  private isReady: boolean = false;

  constructor(options: SequelizeOptions = {}) {
    super(options);

    this.modelsPath = options.modelsDir || './src/models';
    this.migrationsPath = options.migrationsDir || './src/migrations';
    this.seedersPath = options.seedersDir || './src/seeders';

    this.parseModels(this.modelsPath).then(() => {
      this.isReady = true;
      topic.publish('modelsInitialized', this);
    });
    this.updateQueryInterface();
  }

  async ready() {
    if (this.isReady) {
      return;
    }

    return new Promise((resolve) => {
      const token = topic.subscribe('modelsInitialized', () => {
        if (this.isReady) {
          resolve(undefined);
          token.unsubscribe();
        }
      });
    });
  }

  getModelsPath() {
    return this.modelsPath;
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

  async mountCommands(app: ConsoleApplication) {
    const dir = __dirname || dirname(fileURLToPath(
      // FIXME: jest can't parse import.meta.
      'import.meta.url'
    ));

    const token = topic.keep('sequelizeShared', true, this);
    await app.mountCommandPath(join(dir, '..', 'commands'));
    token.release();
  }

  protected async parseModels(modelsPath: string) {
    const matches = await finder(finder.normalize(modelsPath));

    await Promise.all(
      matches.map(async (fileName) => {
        const modules = await import(fileName);

        for (const [key, model] of Object.entries<typeof TemporaryModel>(modules)) {
          if (model && model.prototype instanceof TemporaryModel) {
            model.__init(this, key);
          }
        }
      }),
    );
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

      return createTable.call(this, tableName, attrs, options);
    };

    queryInferface.addColumn = function (
      table: string | { schema?: string; tableName?: string },
      key: string,
      attribute: AdvancedColumn,
      options?: QueryInterfaceOptions
    ): Promise<void> {
      return addColumn.call(this, table, key, getFinalDataType(attribute), options);
    }

    queryInferface.changeColumn = function (
      tableName: string | { schema?: string; tableName?: string },
      attributeName: string,
      dataTypeOrOptions: AdvancedColumn,
      options?: QueryInterfaceOptions
    ): Promise<void> {
      return changeColumn.call(
        this,
        tableName,
        attributeName,
        getFinalDataType(dataTypeOrOptions),
        options
      );
    }
  }
}
