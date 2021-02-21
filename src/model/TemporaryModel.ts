import { Model as Origin, ModelAttributes, ModelCtor, ModelGetterOptions, ModelOptions, ModelSetterOptions, Sequelize } from 'sequelize';
import snake from 'lodash.snakecase';
import { topic } from '../util/topic';
import { BaseColumn } from '../columns/BaseColumn';
import chalk from 'chalk';
import { IncludeFn } from '../types/custom/AssociationType';

interface Options {
  attributes: Record<string, BaseColumn>;
  options: ModelOptions;
  associations?: Record<string, Function>;
  scopes?: Record<string, Function>;
  getters?: ModelGetterOptions;
  setters?: ModelSetterOptions;
}

export class TemporaryModel {
  protected readonly attributes: Record<string, BaseColumn>;
  protected readonly options: ModelOptions;
  protected readonly associations: Record<string, Function>;
  protected readonly scopes: Record<string, Function>;
  protected modelName?: string;

  protected model?: ModelCtor<Origin>;
  protected currentKey?: string;

  constructor(options: Options) {
    this.attributes = options.attributes;
    this.options = options.options;
    this.associations = options.associations || {};
    this.scopes = options.scopes || {};

    this.options.getterMethods = options.getters;
    this.options.setterMethods = options.setters;
    this.modelName = this.options.modelName;
  }

  updateModelName(name: string) {
    if (!this.modelName) {
      this.options.modelName = this.modelName = name;
    }
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
      this.model = model;

      Object.keys(this.associations).forEach((key) => {
        this.currentKey = key;
        this.associations[key]!.call(undefined);
        this.currentKey = undefined;

        const methodName = 'include' + key.substr(0, 1).toUpperCase() + key.substr(1);

        const fn: IncludeFn = function (options = {}) {
          return {
            ...options,
            model: this,
            as: key,
          };
        };

        // @ts-ignore
        model[methodName] = fn;
      });

      Object.keys(this.scopes).forEach((key) => {
        this.currentKey = key;
        const result = this.scopes[key]!.call(undefined);

        // The scope includes association?
        // FIXME: may be not need.
        if (typeof result === 'function') {
          result.call(undefined);
        }
        this.currentKey = undefined;
      });

      this.model = undefined;
    });

    return model;
  }

  protected parseAttributes() {
    const attributes: ModelAttributes = {};

    Object.keys(this.attributes).forEach((attribute) => {
      const descriptor = this.attributes[attribute]!.collect();
      if (descriptor) {
        attributes[attribute] = descriptor;
      }
    });

    return attributes;
  }
}

const setMethod = (key: string, fn: Function) => {
  // @ts-ignore
  TemporaryModel[key] = fn;
};

const originalKeys = Reflect.ownKeys(Origin) as (keyof typeof Origin)[];
const associationKeys: (keyof typeof Origin)[] = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'];

originalKeys.forEach((key) => {
  if (key in TemporaryModel) {
    return;
  }

  const descriptor = Reflect.getOwnPropertyDescriptor(Origin, key);

  // Getter or Setter
  if (!descriptor || descriptor.get || descriptor.set || typeof Origin[key] !== 'function') {
    return;
  }

  if (key === 'addScope') {
    setMethod(key, function (this: TemporaryModel, options: object) {
      if (this.model && this.currentKey) {
        return this.model[key](this.currentKey, options);
      }

      console.error(chalk.red(`You get wrong usage of ${key}, just use it like this:\n`));
      console.error(chalk.red(
`const ModelA = createModel({
  scopes: {
    myName = () => ModelA.${key}({}),
  }
})`
      ));
    });

    return;
  }

  if (associationKeys.includes(key)) {
    setMethod(key, function(this: TemporaryModel, target: Origin, options: object) {
      if (this.model && this.currentKey) {
        return this.model[key](target, {
          ...options,
          as: this.currentKey,
        });
      }

      console.error(chalk.red(`You get wrong usage of ${key}, just use it like this:\n`));
      console.error(chalk.red(
`const ModelA = createModel({
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
