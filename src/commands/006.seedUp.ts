import { ConsoleRouter, validator } from 'qoq';
import { consoleSlots } from './slot';
import { createUmzugForSeeder } from '../migration/createUmzug';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command('db:seed')
  .showInHelp()
  .docs({
    description: 'Run specified seeder',
  })
  .options({
    seed: validator.array.each(validator.string).docs({
      description: 'List of seed files',
    }),
  })
  .action((ctx, payload) => {
    const umzug = createUmzugForSeeder(ctx.sequelize);

    umzug.up({
      migrations: payload.options.seed,
    });
  });

router
  .command('db:seed:all')
  .showInHelp()
  .docs({
    description: 'Run every seeder',
  })
  .action((ctx) => {
    const umzug = createUmzugForSeeder(ctx.sequelize);

    umzug.up();
  });
