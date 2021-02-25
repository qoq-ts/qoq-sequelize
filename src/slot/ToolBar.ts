import chalk from 'chalk';
import { Slot, version } from 'qoq';

export class ToolBar extends Slot<Slot.Console> {
  constructor() {
    super();
    const { version: sequelizeVersion } = require('sequelize/package.json');
    const nodeVersion = process.version.slice(1);

    this.use(async (_, next) => {
      console.log(chalk.underline(`\nSequelize [Node: ${nodeVersion}, Fomex: ${version}, Sequelize: ${sequelizeVersion}]\n`));

      await next();
      console.log('');
    });
  }
}
