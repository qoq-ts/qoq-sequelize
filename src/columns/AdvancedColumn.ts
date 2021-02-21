import { ModelAttributeColumnReferencesOptions, ModelAttributeColumnOptions } from 'sequelize';
import { BaseColumn, BaseColumnOptions } from './BaseColumn';

interface ReferenceOptions extends ModelAttributeColumnReferencesOptions {
  onUpdate: 'CASCADE' | 'RESTRICT' | 'SET DEFAULT' | 'SET NULL' | 'NO ACTION';
  onDelete: 'CASCADE' | 'RESTRICT' | 'SET DEFAULT' | 'SET NULL' | 'NO ACTION';
}

export abstract class AdvancedColumn<T extends BaseColumnOptions<any> = BaseColumnOptions<any>> extends BaseColumn<T> {
  public unique(is: boolean | string | { name: string; msg: string }): this {
    this.config.unique = is;
    return this;
  }

  public primaryKey(): any {
    this.config.primaryKey = true;
    return this;
  }

  public notNull(): any {
    this.config.allowNull = false;
    return this;
  }

  public default(value: any): any {
    this.config.defaultValue = value;
    return this;
  }

  public comment(comment: string): this {
    this.config.comment = comment;
    return this;
  }

  public reference(options: ReferenceOptions): this {
    const { onDelete, onUpdate, ...rest } = options;
    this.config.references = rest;
    this.config.onUpdate = onUpdate;
    this.config.onDelete = onDelete;
    return this;
  }

  public field(field: string): this {
    this.config.field = field;
    return this;
  }

  public/*protected*/ collect(): ModelAttributeColumnOptions {
    return super.collect() as ModelAttributeColumnOptions;
  }
}
