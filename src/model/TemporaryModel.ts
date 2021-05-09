import { AddScopeOptions, Model, ModelAttributes } from 'sequelize';
import snake from 'lodash.snakecase';
import chalk from 'chalk';
import { BaseColumn } from '../columns/BaseColumn';
import { IncludeFn } from '../types/custom/AssociationType';
import { Sequelize } from './Sequelize';
import { Model as AdvancedModel } from '../types/override/Model';
import type { DefineModelOptions } from './defineModel';
import { topic } from '../util/topic';
import { OrderHelper } from './OrderHelper';

export abstract class TemporaryModel extends Model {
  static __currentKey?: string;

  static __INIT__?: DefineModelOptions<{ [key: string]: BaseColumn }, { [key: string]: Function }, { [key: string]: Function }, any, any, any, any, any, any>;

  static include: Record<string, IncludeFn<any, AdvancedModel, string>> = {};
  static order: OrderHelper;
  protected static __ORDER__: typeof OrderHelper;

  static __init(sequelize: Sequelize, modelName: string) {
    if (!this.__INIT__) {
      return;
    }

    const { attributes, associations = {}, scopes = {}, options = {} } = this.__INIT__;
    this.__INIT__ = undefined;

    if (!options.modelName) {
      options.modelName = modelName;
    }

    if (!options.tableName) {
      const freezeTableName = !!options.freezeTableName;
      options.tableName = freezeTableName ? modelName : snake(modelName);
    }

    const parsedAttributes: ModelAttributes = {};

    Object.keys(attributes).forEach((attribute) => {
      parsedAttributes[attribute] = attributes[attribute]!.collect();
    });

    // @ts-ignore
    this.init(
      parsedAttributes,
      {
        ...options,
        sequelize,
      }
    );

    topic.subscribeOnce('modelsInitialized', (s) => {
      if (s !== sequelize) {
        return;
      }

      const that = this;
      const CustomOrder = this.__ORDER__ = class extends OrderHelper {}
      this.order = new CustomOrder([]);

      Object.keys(associations).forEach((methodName) => {
        this.__currentKey = methodName;
        associations[methodName]!.call(undefined);
        this.__currentKey = undefined;

        this.include[methodName] = (options = {}) => {
          const association = (this as unknown as typeof AdvancedModel).associations[methodName]!;
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
            association,
          };
        };

        Object.defineProperty(CustomOrder.prototype, methodName, {
          get(this: OrderHelper) {
            const association = (that as unknown as typeof AdvancedModel).associations[methodName]!;
            const NextOrderChain = (association.target as unknown as typeof TemporaryModel).__ORDER__;

            return new NextOrderChain(this.orderItem.concat(association));
          },
        });
      });

      Object.keys(scopes).forEach((key) => {
        this.__currentKey = key;
        scopes[key]!.call(undefined);
        this.__currentKey = undefined;
      });
    });
  }
}

function overrideAddScope() {
  const origin = TemporaryModel.addScope;

  // @ts-ignore
  TemporaryModel.addScope = function(scope: object | Function, options?: AddScopeOptions) {
    if (this.__currentKey) {
      const customScope = typeof scope === 'function'
        ? scope.bind(null, (helper: object) => helper)
        : scope;

      return origin.call(
        // @ts-ignore
        this,
        this.__currentKey,
        customScope,
        options,
      );
    }

    console.error(chalk.red(`You get wrong usage of addScope, just use it like this:\n`));
    console.error(chalk.red(
`export const ModelA = defineModel({
  scopes: {
    myName = () => ModelA.addScope({}),
  }
})`
    ));

    return;
  }
}

function overrideAssociation(key: 'hasMany' | 'hasOne' | 'belongsTo' | 'belongsToMany') {
  const origin = TemporaryModel[key];

  // @ts-ignore
  TemporaryModel[key] = function(target: Model, options: object) {
    if (this.__currentKey) {
      // @ts-ignore
      return origin.call(
        this,
        target,
        {
          ...options,
          as: this.__currentKey,
        }
      );
    }

    console.error(chalk.red(`You get wrong usage of ${key}, just use it like this:\n`));
    console.error(chalk.red(
`expor const ModelA = defineModel({
  associations: {
    myName: () => ModelA.${key}(ModelB),
  }
})`
    ));

    return;
  }
};

overrideAddScope();
overrideAssociation('hasMany');
overrideAssociation('hasOne');
overrideAssociation('belongsTo');
overrideAssociation('belongsToMany');
