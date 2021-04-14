import { consoleSlots } from './slot';
import { createUmzugForMigration } from '../migration/createUmzug';
import { ConsoleRouter, validator } from 'qoq';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:migrate:undo')
  .showInHelp()
  .docs({
    description: 'Reverts a migration',
  })

  .action(async (ctx) => {
    const umzug = await createUmzugForMigration(ctx.sequelize);

    return umzug.down({
      step: 1,
    });
  });

router
  .command('db:migrate:undo:all')
  .showInHelp()
  .docs({
    description: 'Revert all migrations ran',
  })
  .options({
    to: validator.string.optional().docs({
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
