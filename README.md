# qoq-sequelize
qoq orm based on [sequelize@6](https://github.com/sequelize/sequelize) that have totally rewritten type files to make your logic code stronger.

[![License](https://img.shields.io/github/license/qoq-ts/qoq-sequelize)](https://github.com/qoq-ts/qoq-sequelize/blob/master/LICENSE)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/qoq-ts/qoq-sequelize/CI/master)](https://github.com/qoq-ts/qoq-sequelize/actions)
[![Codecov](https://img.shields.io/codecov/c/github/qoq-ts/qoq-sequelize)](https://codecov.io/gh/qoq-ts/qoq-sequelize)
[![npm](https://img.shields.io/npm/v/qoq-sequelize)](https://www.npmjs.com/package/qoq-sequelize)

# Installation

```bash
yarn add qoq-sequelize
```

You'll also have to manually install the driver for database from your choice:

```bash
# One of the following:
yarn add pg pg-hstore # Postgres
yarn add mysql2
yarn add mariadb
yarn add sqlite3
yarn add tedious # Microsoft SQL Server
```

Remember **DO NOT** install package `sequelize` and `sequelize-cli` by yourself!

# Full documents
Just link to the [sequelize website](https://sequelize.org/master/index.html).

# What's the difference?
### Initialization
```typescript
// Origin
import { Sequelize } from 'sequelize';
export const sequelize = new Sequelize({});

// Current
import { Sequelize } from 'qoq-sequelize';
export const sequelize = new Sequelize();
```

### Attributes
```typescript
// Origin
export const User = sequelize.define('User', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataType.VARCHAR,
    allowNull: false,
  },
});

// Current
export const User = defineModel({
  attributes: {
    id: column.int.primaryKey(),
    name: column.varchar.notNull(),
  }
});
```

### Scopes
```typescript
// Origin
const User = sequelize.define('User', {}, {
  scopes: {
    x: {
      attributes: ['id', 'name']
      where: {},
      include: [
        {
          model: Project,
          as: 'projects',
          attributes: ['id', 'name'],
          where: {},
        },
      ],
    }
  },
});

// Current
const User = defineModel({
  scopes: {
    x: () => User.addScope({
      attribures: ['id', 'name'], // With type annotation
      where: {}, // With type annotation
      include: [
        User.associateProjects({ // With type annotation `associateProjects`
          attributes: ['id', 'name'], // With type annotation
          where: {}, // With type annotation
        }),
      ],
    }),
  },
});
```
