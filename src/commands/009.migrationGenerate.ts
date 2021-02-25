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
  .command(['migration:generate', 'migration:create'])
  .showInHelp()
  .docs({
    description: 'Generates a new migration file',
  })
  .options({
    name: validator.string.docs({
      description: 'Defines the name of the migration',
    }),
  })
  .action((ctx) => {
    const templateContent = getTemplateContent('migration');
    const outputFileName =  generateFileNameWithDateTime(ctx.options.name);
    const migrationPath = path.resolve(ctx.db.migrationsPath, outputFileName);

    mkdirp.sync(ctx.db.migrationsPath);
    fs.writeFileSync(migrationPath, templateContent);
    console.log('New migration was created at: ' + chalk.blueBright(migrationPath));
  });
