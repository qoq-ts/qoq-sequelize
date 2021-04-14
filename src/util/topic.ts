import { Topic } from 'topic';
import { Sequelize } from '../model/Sequelize';

export const topic = new Topic<{
  modelsInitialized: (sequelize: Sequelize) => void;
  sequelizeShared: (sequelize: Sequelize) => void;
}>();
