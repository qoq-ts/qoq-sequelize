import { column, defineModel } from '../../../src';

export const UserProject = defineModel({
  attributes: {
    user_id: column.int.notNull(),
    project_id: column.int.notNull(),
  },
});
