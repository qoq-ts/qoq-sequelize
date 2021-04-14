import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const dir = __dirname || dirname(fileURLToPath(
  // FIXME: jest can't parse import.meta.
  'import.meta.url'
));

export const getTemplateContent = (fileName: string) => {
  return fs.readFileSync(join(dir, '..', 'template', fileName + '.tpl')).toString();
};
