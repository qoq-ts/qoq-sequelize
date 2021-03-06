import sequelize from 'sequelize';
import { Sequelize } from '../model/Sequelize';

export const createMeta = (instance: Sequelize, modelName: string = 'SequelizeMeta') => {
  return instance.define(
    modelName,
    {
      name: {
        /**
         * As string type primary key, mysql will limit the byte length.
         * For utf8   , the maximum key length is: 767 / 3 = 255.67
         * For utf8mb4, the maximum key length is: 767 / 4 = 191.75
         */
        type: sequelize.DataTypes.STRING(190),
        primaryKey: true,
      },
    },
    {
      tableName: 'sequelize_meta',
      underscored: true,
      timestamps: true,
      updatedAt: false,
      paranoid: false,
    },
  );
};
