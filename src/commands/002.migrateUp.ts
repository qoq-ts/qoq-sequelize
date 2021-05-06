import { createUmzugForMigration } from '../migration/createUmzug';
import { ConsoleRouter, validator } from 'qoq';
import { consoleSlots } from './slot';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:migrate')
  .showInHelp()
  .description('Run pending migrations')
  .options({
    to: validator.string.optional().document({
      description: 'Migration name to run migrations until',
    }),
  })
  .action(async (ctx, payload) => {
    const umzug = await createUmzugForMigration(ctx.sequelize);
    await umzug.up({
      to: payload.options.to,
    });
  });
