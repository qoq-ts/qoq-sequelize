import { ProjectionAlias } from './ProjectionAlias';

export type FindAttributeOptions<AttrsKeys> =
| ( AttrsKeys | ProjectionAlias<AttrsKeys> | '*')[]
| {
  exclude: (AttrsKeys)[];
  include?: (AttrsKeys | ProjectionAlias<AttrsKeys>)[];
}
| {
  exclude?: (AttrsKeys)[];
  include: ((AttrsKeys) | ProjectionAlias<AttrsKeys>)[];
};
