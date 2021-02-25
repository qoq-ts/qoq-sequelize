import { column, defineModel } from '../../../src';

export const User = defineModel({
  attributes: {
    id: column.int.primaryKey(),
  },
});

export const Project = defineModel({
  attributes: {
    id: column.int.primaryKey(),
  }
});
