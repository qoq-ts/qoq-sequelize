import chalk from 'chalk';
import { ConsoleRouter } from 'qoq';
import { consoleSlots } from './slot';
import { createUmzugForMigration } from '../migration/createUmzug';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:migrate:status')
  .showInHelp()
  .docs({
    description: 'List the status of all migrations',
  })
  .action(async (ctx) => {
    const umzug = await createUmzugForMigration(ctx.sequelize);
    const executed = await umzug.executed();
    const pending = await umzug.pending();

    executed.forEach((item) => {
      console.log(chalk.green('up ') + item.name);
    });

    pending.forEach((item) => {
      console.log(chalk.yellow('down ') + item.name);
    });
  });
