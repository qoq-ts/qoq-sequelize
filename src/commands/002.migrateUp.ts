import { createUmzugForMigration } from '../migration/createUmzug';
import { ConsoleRouter, validator } from 'qoq';
import { consoleSlots } from './slot';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:migrate')
  .showInHelp()
  .docs({
    description: 'Run pending migrations',
  })
  .options({
    to: validator.string.optional().docs({
      description: 'Migration name to run migrations until',
    }),
  })
  .action(async (ctx) => {
    const umzug = createUmzugForMigration(ctx.db);
    await umzug.up({
      to: ctx.options.to,
    });
  });
