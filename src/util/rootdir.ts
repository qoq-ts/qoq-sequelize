import { dirname } from 'path';
import { createContext } from 'this-file';

export const rootdir = dirname(createContext().dirname);
