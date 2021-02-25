import { Topic } from 'topic';
import { Sequelize } from '../model/Sequelize';

export const topic = new Topic<{
  modelsInitialized: () => void;
  sequelizeShared: (sequelize: Sequelize) => void;
}>();
