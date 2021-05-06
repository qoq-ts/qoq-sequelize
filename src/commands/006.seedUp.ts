import { ConsoleRouter, validator } from 'qoq';
import { consoleSlots } from './slot';
import { createUmzugForSeeder } from '../migration/createUmzug';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:seed')
  .showInHelp()
  .description('Run specified seeder')
  .options({
    seed: validator.array.each(validator.string).document({
      description: 'List of seed files',
    }),
  })
  .action(async (ctx, payload) => {
    const umzug = await createUmzugForSeeder(ctx.sequelize);

    umzug.up({
      migrations: payload.options.seed,
    });
  });

router
  .command('db:seed:all')
  .showInHelp()
  .description('Run every seeder')
  .action(async (ctx) => {
    const umzug = await createUmzugForSeeder(ctx.sequelize);
    await umzug.up();
  });
