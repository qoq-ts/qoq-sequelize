import { column, defineModel } from '../../src';
import { TemporaryModel } from '../../src/model/TemporaryModel';

it ('can create temporary model', () => {
  const User = defineModel({
    attributes: {
      id: column.int.primaryKey(),
    }
  });

  expect(User).toBeInstanceOf(TemporaryModel);
});
