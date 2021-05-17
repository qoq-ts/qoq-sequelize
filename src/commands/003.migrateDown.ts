import { consoleSlots } from './slot';
import { createUmzugForMigration } from '../migration/createUmzug';
import { ConsoleRouter, validator } from 'qoq';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:migrate:undo')
  .showInHelp()
  .description('Reverts a migration')
  .options({
    step: validator.integer.min(1).optional(),
  })
  .action(async (ctx, payload) => {
    const { step } = payload.options;
    const umzug = await createUmzugForMigration(ctx.sequelize);

    return umzug.down({
      step: step ?? 1,
    });
  });

router
  .command('db:migrate:undo:all')
  .showInHelp()
  .description('Revert all migrations ran')
  .options({
    to: validator.string.optional().document({
      description: 'Revert to the provided migration',
    }),
  })
  .action(async (ctx, payload) => {
    const umzug = await createUmzugForMigration(ctx.sequelize);
    const { to } = payload.options;

    return umzug.down({
      to: to || 0,
    });
  });
