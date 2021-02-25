import { ColumnOptions, DataType, ModelAttributeColumnReferencesOptions, ModelValidateOptions } from 'sequelize';
import { Model } from './model';

/**
 * Column options for the model schema attributes
 */
export interface ModelAttributeColumnOptions<M extends Model = Model> extends ColumnOptions {
  /**
   * A string or a data type
   */
  type: DataType;

  /**
   * If true, the column will get a unique constraint. If a string is provided, the column will be part of a
   * composite unique index. If multiple columns have the same string, they will be part of the same unique
   * index
   */
  unique?: boolean | string | { name: string; msg: string };

  /**
   * Primary key flag
   */
  primaryKey?: boolean;

  /**
   * Is this field an auto increment field
   */
  autoIncrement?: boolean;

  /**
   * If this field is a Postgres auto increment field, use Postgres `GENERATED BY DEFAULT AS IDENTITY` instead of `SERIAL`. Postgres 10+ only.
   */
  autoIncrementIdentity?: boolean;

  /**
   * Comment for the database
   */
  comment?: string;

  /**
   * An object with reference configurations or the column name as string
   */
  references?: string | ModelAttributeColumnReferencesOptions;

  /**
   * What should happen when the referenced key is updated. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
   * NO ACTION
   */
  onUpdate?: string;

  /**
   * What should happen when the referenced key is deleted. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
   * NO ACTION
   */
  onDelete?: string;


  /**
   * An object of validations to execute for this column every time the model is saved. Can be either the
   * name of a validation provided by validator.js, a validation function provided by extending validator.js
   * (see the
   * `DAOValidator` property for more details), or a custom validation function. Custom validation functions
   * are called with the value of the field, and can possibly take a second callback argument, to signal that
   * they are asynchronous. If the validator is sync, it should throw in the case of a failed validation, it
   * it is async, the callback should be called with the error text.
   */
  validate?: ModelValidateOptions;

  /**
   * Usage in object notation
   *
   * ```js
   * class MyModel extends Model {}
   * MyModel.init({
   *   states: {
   *     type:   Sequelize.ENUM,
   *     values: ['active', 'pending', 'deleted']
   *   }
   * }, { sequelize })
   * ```
   */
  values?: readonly string[];

  /**
   * Provide a custom getter for this column. Use `this.getDataValue(String)` to manipulate the underlying
   * values.
   */
  get?(this: M): unknown;

  /**
   * Provide a custom setter for this column. Use `this.setDataValue(String, Value)` to manipulate the
   * underlying values.
   */
  set?(this: M, val: unknown): void;
}
