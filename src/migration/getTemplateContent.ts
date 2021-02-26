import fs from 'fs';
import path from 'path';

export const getTemplateContent = (fileName: string) => {
  return fs.readFileSync(path.join(__dirname, '..', 'template', fileName + '.tpl')).toString();
};
