import { column } from '../columns';
import { defineModel } from '../model/defineModel';

export const SequelizeMeta = defineModel({
  attributes: {
    name: column.varChar.primaryKey().notNull(),
  },
  options: {
    modelName: 'SequelizeMeta',
    tableName: 'sequelize_meta',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    paranoid: false,
  },
});
