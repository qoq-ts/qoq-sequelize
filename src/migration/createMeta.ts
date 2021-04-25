import { DataTypes } from 'sequelize';
import { Sequelize } from '../model/Sequelize';

export const createMeta = (sequelize: Sequelize) => {
  return sequelize.define(
    'SequelizeMeta',
    {
      name: {
        /**
         * As string type primary key, mysql will limit the byte length.
         * For utf8   , the maximum key length is: 767 / 3 = 255.67
         * For utf8mb4, the maximum key length is: 767 / 4 = 191.75
         */
        type: DataTypes.STRING(190),
        primaryKey: true,
      },
    },
    {
      tableName: 'sequelize_meta',
      underscored: false,
      timestamps: true,
      updatedAt: false,
      paranoid: false,
    },
  );
};
