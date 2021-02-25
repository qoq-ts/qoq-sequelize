import { ColumnOptions } from 'sequelize/types';

/** Foreign Key Options */
export interface ForeignKeyOptions<Attrs> extends ColumnOptions {
  /** Attribute name for the relation */
  name?: keyof Attrs;
}
