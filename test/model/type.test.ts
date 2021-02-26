/**
 * Actually, this file execute nothing except type checking.
 */

import { column, defineModel } from '../../src';
import { Project } from '../fixture/models/Project';
import { User } from '../fixture/models/User';
import { UserProject } from '../fixture/models/UserProject';

test ('Type checking only', () => {});

export function _attributes() {
  User.findOne({
    attributes: [
      'id', 'name', ['id', 'xxx'], '*',
      // @ts-expect-error
      'name1',
    ],
  });
}

export async function _findOne() {
  const user = await User.findOne({});

  // @ts-expect-error
  user.id;

  user?.id.toFixed();
  user?.get('id').toPrecision();

  user?.name.toLowerCase();
  user?.get('name').toUpperCase();

  // unknown type
  user?.get('ids');
  // @ts-expect-error
  user?.ids;
  // @ts-expect-error
  user?.get('ids').toUpperCase();
}

export async function _findOneReject() {
  const user = await User.findOne({
    rejectOnEmpty: true,
  });

  user.id.toFixed();
  user.get('id').toPrecision();

  user.name.toLowerCase();
  user.get('name').toUpperCase();
}

export async function _findAll() {
  const user = await User.findAll();

  // @ts-expect-error
  user[0].id;

  user[0]?.id.toFixed();
  user[0]?.get('id').toPrecision();

  user[0]?.name.toLowerCase();
  user[0]?.get('name').toUpperCase();
}

export async function _instanceAssociation() {
  const user = await User.findOne({
    rejectOnEmpty: true,
  });

  (await user.getProjects())[0]?.userId.toFixed();
  // @ts-expect-error
  user.getProject;
  user.setProjects();
  // @ts-expect-error
  user.setProject;
  user.hasProject(1);
  user.hasProjects([1, 2]);
  user.removeProject(1);
  user.removeProjects([1, 2]);
  user.countProjects();
  // @ts-expect-error
  user.countProject;
}

export async function _AddScope() {
  User.addScope({
    attributes: ['id', 'name'],
  });

  // @ts-expect-error
  User.addScope({
    attributes: ['id', 'name123']
  });

  User.addScope({
    attributes: ['id', 'name'],
    include: [
      User.associateProjects(),
      User.associateProjs({}),
    ]
  });

  // @ts-expect-error
  User.addScope({
    include: [
      'xyz',
    ]
  });

  User.addScope((wrap, _hello: string) => wrap({
    attributes: ['id', 'name'],
  }));

  User.addScope((wrap, _hello: string) => wrap({
    attributes: [
      'id',
      // @ts-expect-error
      'name123'
    ],
    include: [
      User.associateProjects(),
      // @ts-expect-error
      'xyz',
    ],
  }));
}

export async function _scope() {
  User.scope('limitAge');
  User.scope('defaultScope');
  // @ts-expect-error
  User.scope('non-exist');

  User.scope('limitAge').findAll({
    attributes: ['name'],
  });

  User.scope('withName').findOne({
    attributes: [
      // @ts-expect-error
      'ids'
    ],
  });

  User.scope('defaultScope').associateProjs({
    scope: 'hasDesc',
  });

  User.scope('defaultScope').associateProjs({
    // @ts-expect-error
    scope: 'hasDesc123',
  });

  User.scope('limitAge').unscoped().associateProjects();
}

export async function _association() {
  User.associateProjects();

  User.associateProjs({
    attributes: [
      'description',
      // @ts-expect-error
      'title11',
    ],
    include: [
      Project.associateUser({
        attributes: [
          'name',
          // @ts-expect-error
          'name1234',
        ],
      }),
    ],
  });

  // @ts-expect-error
  User.associateProject;
}

export async function _associationValue() {
  const user = await User.findOne({
    rejectOnEmpty: true,
  });

  user.projects[0]?.user.projects[1]?.user.projects[0]?.user.age.toFixed();
  user.projects[0]?.get('user').get('projects')[1]?.get('user').projects[0]?.title.toLowerCase();
  user.getProjects();
  user.projects[0]?.getUser();

  const plain = user.get({ plain: true });
  plain.projects[0]?.user.projects[1]?.user.projects[0]?.user.age.toFixed();
  plain.projects[0]?.user.projects[1]?.user.projects[0]?.title.toLowerCase();
  // @ts-expect-error
  plain.getProjects;
  // @ts-expect-error
  plain.projects[0]?.getUser;

  const plain1 = user.get('projects', { plain: true });
  plain1[0]?.description?.toLowerCase();
  plain1[0]?.user.projects[0]?.user.age.toFixed();
  // @ts-expect-error
  plain1[0]?.get;
  // @ts-expect-error
  plain1[0]?.getUser;

  const project = user.get('projects');
  project[0]?.user.projects[0]?.user.age.toFixed();
  project[0]?.get('user').get('projects')[0]?.user.age.toFixed();
  project[0]?.get('userId');
  project[0]?.getUser();
}

export function _getterSetter() {
  defineModel({
    attributes: {
      id: column.int,
      id1: column.int.primaryKey(),
      name: column.char,
    },
    options: {
      setterMethods: {
        id(value) {
          value?.toFixed();
          this.set('id', value);
        },
        id1(value) {
          value.toFixed();
          // @ts-expect-error
          this.set('id1', value.toString());
        },
        name(value) {
          value?.toLowerCase();
          // @ts-expect-error
          this.set('name', 0);
        }
      },
      getterMethods: {
        // @ts-expect-error
        id() {
          return '2';
        },
        id1() {
          return 2;
        },
        name() {
          return '2';
        }
      }
    }
  })
}

export async function _through() {
  User.belongsToMany(Project, {
    through: UserProject,
    foreignKey: 'project_id',
    otherKey: 'user_id',
  });

  User.belongsToMany(Project, {
    through: UserProject,
    // @ts-expect-error
    foreignKey: 'name',
    // @ts-expect-error
    otherKey: 'user_ids',
  });
}
