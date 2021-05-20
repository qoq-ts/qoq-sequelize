import fs from 'fs';
import { join } from 'path';
import { rootdir } from '../util/rootdir';

export const getTemplateContent = (fileName: string) => {
  return fs.readFileSync(join(rootdir, 'template', fileName + '.tpl')).toString();
};
