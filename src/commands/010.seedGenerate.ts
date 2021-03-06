import path from 'path';
import fs from 'fs';
import { ConsoleRouter, validator } from 'qoq';
import mkdirp from 'mkdirp';
import { consoleSlots } from './slot';
import { getTemplateContent } from '../migration/getTemplateContent';
import { generateFileNameWithDateTime } from '../migration/generateFileNameWithDateTime';
import chalk from 'chalk';

export const router = new ConsoleRouter({
  slots: consoleSlots,
});

router
  .command(['seed:generate', 'seed:create'])
  .showInHelp()
  .description('Generates a new seed file')
  .options({
    name: validator.string.document({
      description: 'Defines the name of the seed',
    }),
  })
  .action((ctx, payload) => {
    const templateContent = getTemplateContent('seed');
    const outputFileName = generateFileNameWithDateTime(payload.options.name);
    const seedPath = path.resolve(ctx.sequelize.seedersPath, outputFileName);

    mkdirp.sync(ctx.sequelize.seedersPath);
    fs.writeFileSync(seedPath, templateContent);
    console.log('New migration was created at: ' + chalk.blueBright(seedPath));
  });
