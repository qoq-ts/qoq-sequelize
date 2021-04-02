import { AddScopeOptions, Model, ModelAttributes, ModelCtor, ModelOptions } from 'sequelize';
import snake from 'lodash.snakecase';
import chalk from 'chalk';
import { topic } from '../util/topic';
import { BaseColumn } from '../columns/BaseColumn';
import { IncludeFn } from '../types/custom/AssociationType';
import { Sequelize } from './Sequelize';
import { Model as AdvancedModel } from '../types/override/Model';

interface Options {
  attributes: Record<string, BaseColumn>;
  options: ModelOptions;
  associations?: Record<string, Function>;
  scopes?: Record<string, Function>;
}

export class TemporaryModel {
  public include: Record<string, Function> = {};

  protected readonly attributes: Record<string, BaseColumn>;
  protected readonly options: ModelOptions;
  protected readonly associations: Record<string, Function>;
  protected readonly scopes: Record<string, Function>;
  protected modelName?: string;

  protected model?: ModelCtor<Model>;
  protected currentKey?: string;

  constructor(options: Options) {
    this.attributes = options.attributes;
    this.options = options.options || {};
    this.associations = options.associations || {};
    this.scopes = options.scopes || {};

    this.modelName = this.options.modelName;
  }

  updateModelName(name: string): this {
    if (!this.modelName) {
      this.options.modelName = this.modelName = name;
    }

    return this;
  }

  define(sequelize: Sequelize) {
    const modelName = this.modelName;
    if (!modelName) {
      throw new Error('Model Name is required');
    }

    let tableName = this.options.tableName;
    if (!tableName) {
      const freezeTableName = !!this.options.freezeTableName;
      tableName = freezeTableName ? modelName : snake(modelName);
    }

    const model = sequelize.define(modelName, this.parseAttributes(), {
      tableName,
      ...this.options,
    });

    topic.subscribeOnce('modelsInitialized', () => {
      const include: Record<string, Function> = {};

      this.model = model;
      // @ts-ignore
      model.include = include;

      Object.keys(this.associations).forEach((methodName) => {
        this.currentKey = methodName;
        this.associations[methodName]!.call(undefined);
        this.currentKey = undefined;

        const fn: IncludeFn<any, AdvancedModel, string> = function (options = {}) {
          const association = (model as unknown as typeof AdvancedModel).associations[methodName]!;
          const { scope, ...rest } = options;

          if (scope) {
            return {
              ...rest,
              model: association.target.scope(scope),
              as: methodName,
            };
          }

          return {
            ...rest,
            model: association.target,
            as: methodName,
          };
        };

        this.include[methodName] = include[methodName] = fn;
      });

      Object.keys(this.scopes).forEach((key) => {
        this.currentKey = key;
        this.scopes[key]!.call(undefined);
        this.currentKey = undefined;
      });
    });

    return model;
  }

  protected parseAttributes() {
    const attributes: ModelAttributes = {};

    Object.keys(this.attributes).forEach((attribute) => {
      attributes[attribute] = this.attributes[attribute]!.collect();
    });

    return attributes;
  }
}

const setMethod = (key: string, fn: Function) => {
  // @ts-expect-error
  TemporaryModel.prototype[key] = fn;
};

const originalKeys = Reflect.ownKeys(Model) as (keyof typeof Model)[];
const associationKeys: (keyof typeof Model)[] = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'];

originalKeys.forEach((key) => {
  if (key in TemporaryModel) {
    return;
  }

  const descriptor = Reflect.getOwnPropertyDescriptor(Model, key);

  // Getter or Setter
  if (!descriptor || descriptor.get || descriptor.set || typeof Model[key] !== 'function') {
    return;
  }

  if (key === 'addScope') {
    setMethod(key, function (this: TemporaryModel, scope: object | Function, options?: AddScopeOptions) {
      if (this.model && this.currentKey) {
        const customScope = typeof scope === 'function'
          ? scope.bind(null, (helper: object) => helper)
          : scope;
        return this.model[key](this.currentKey, customScope, options);
      }

      console.error(chalk.red(`You get wrong usage of ${key}, just use it like this:\n`));
      console.error(chalk.red(
`const ModelA = defineModel({
  scopes: {
    myName = () => ModelA.${key}({}),
  }
})`
      ));
    });

    return;
  }

  if (associationKeys.includes(key)) {
    setMethod(key, function(this: TemporaryModel, target: Model, options: object) {
      if (this.model && this.currentKey) {
        return this.model[key](target, {
          ...options,
          as: this.currentKey,
        });
      }

      console.error(chalk.red(`You get wrong usage of ${key}, just use it like this:\n`));
      console.error(chalk.red(
`const ModelA = defineModel({
  associations: {
    myName: () => ModelA.${key}(ModelB),
  }
})`
      ));
    });

    return;
  }

  setMethod(key, function (this: TemporaryModel) {
    if (this.model) {
      return this.model[key].apply(this.model, arguments);
    }

    console.error(chalk.red(`You get wrong usage of ${key}, it's forbidden to use in model file.\n`));
  });
});
