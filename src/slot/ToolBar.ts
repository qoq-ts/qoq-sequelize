import chalk from 'chalk';
import { Slot, version } from 'qoq';

export class ToolBar extends Slot<Slot.Console> {
  constructor() {
    super();
    const nodeVersion = process.version.slice(1);

    this.use(async (_, next) => {
      console.log(chalk.underline(`\nSequelize [Node: ${nodeVersion}, QoQ: ${version}]\n`));

      await next();
      console.log('');
    });
  }
}
