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
  .docs({
    description: 'Generates a new seed file',
  })
  .options({
    name: validator.string.docs({
      description: 'Defines the name of the seed',
    }),
  })
  .action((ctx, payload) => {
    const templateContent = getTemplateContent('seed');
    const outputFileName =  generateFileNameWithDateTime(payload.options.name);
    const seedPath = path.resolve(ctx.db.seedersPath, outputFileName);

    mkdirp.sync(ctx.db.seedersPath);
    fs.writeFileSync(seedPath, templateContent);
    console.log('New migration was created at: ' + chalk.blueBright(seedPath));
  });
