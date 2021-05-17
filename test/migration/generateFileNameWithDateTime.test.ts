import { generateFileNameWithDateTime } from '../../src/migration/generateFileNameWithDateTime';

it('can generate file name', () => {
  expect(generateFileNameWithDateTime('create')).toMatch(/^\d{14}-create\.ts$/);
  expect(generateFileNameWithDateTime('updateMe')).toMatch(/^\d{14}-updateMe\.ts$/);
});

it('invalid symbol will be removed', () => {
  expect(generateFileNameWithDateTime('update/Me')).toMatch(/^\d{14}-updateMe\.ts$/);
});
