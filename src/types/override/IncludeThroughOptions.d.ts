import { Filterable } from 'sequelize';
import { Projectable } from './Projectable';

/**
 * Through options for Include Options
 */
export interface IncludeThroughOptions<Attrs> extends Filterable<any>, Projectable<Attrs> {
  /**
   * The alias of the relation, in case the model you want to eagerly load is aliassed. For `hasOne` /
   * `belongsTo`, this should be the singular name, and for `hasMany`, it should be the plural
   */
  as?: string;
}
