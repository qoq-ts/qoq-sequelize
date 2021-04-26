import { Slot } from 'qoq';
import { Sequelize } from '../model/Sequelize';
import { topic } from '../util/topic';

export class SequelizeSlot extends Slot<Slot.Mix, { sequelize: Sequelize }> {
  protected instance?: Sequelize;

  constructor(sequelize: Sequelize) {
    super();

    this.instance = sequelize;
    this.use(async (ctx, next) => {
      if (!this.instance) {
        throw new Error('Sequelize instance doesn\'t exist');
      }

      ctx.sequelize = this.instance;
      await next();
    });
  }

  public/*protected*/ fromShared() {
    topic.subscribe('sequelizeShared', (sequelize) => {
      this.instance = sequelize;
    });
    return this;
  }
}
