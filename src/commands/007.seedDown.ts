import { consoleSlots } from './slot';
import { createUmzugForSeeder } from '../migration/createUmzug';
import { ConsoleRouter, validator } from 'qoq';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:seed:undo')
  .showInHelp()
  .docs({
    description: 'Deletes data from the database',
  })
  .action(async (ctx) => {
    const umzug = createUmzugForSeeder(ctx.db);

    await umzug.down({
      step: 1,
    });
  });

router
  .command('db:seed:undo:all')
  .showInHelp()
  .docs({
    description: 'Deletes data from the database',
  })
  .options({
    to: validator.string.optional().docs({
      description: 'Revert to the provided migration',
    }),
  })
  .action(async (ctx, payload) => {
    const umzug = createUmzugForSeeder(ctx.db);
    const { to } = payload.options;

    await umzug.down({
      to: to || 0,
    });
  });
