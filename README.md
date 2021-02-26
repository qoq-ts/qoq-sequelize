# qoq-sequelize
qoq orm based on [sequelize@6](https://github.com/sequelize/sequelize) that totally rewritten type files to make your logic code stronger.

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
Just see the [sequelize website](https://sequelize.org/master/index.html), and take a second please to see the minimum [engine version](https://github.com/sequelize/sequelize/blob/main/ENGINE.md#v6) which are supported by sequelize.

# What's the difference?
### Initialization
#### Before
```typescript
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  ...
});
```
#### After
```typescript
import { Sequelize } from 'qoq-sequelize';

export const sequelize = new Sequelize({
  modelsPath: './src/models', // optional
  migrationsPath: './src/migrations', // optional
  seedersPath: './src/seeders', // optional
  dialect: 'sqlite',
  ...
});
```

### Attributes
#### Before
```typescript
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
```

#### After
```typescript
import { defineModel, column } from 'qoq-sequelize';

export const User = defineModel({
  attributes: {
    id: column.int.primaryKey(),
    name: column.varChar.notNull(),
  }
});
```
What amazing things will happen next?
<br>
![](https://github.com/qoq-ts/qoq-sequelize/blob/master/images/attributes-1.png?raw=true)
![](https://github.com/qoq-ts/qoq-sequelize/blob/master/images/attributes-2.png?raw=true)

### Scopes
#### Before
```typescript
const User = sequelize.define('User', {}, {
  scopes: {
    testMe: {
      attributes: ['id', 'name']
      where: {
        id: 2,
      },
    }
  },
});
```
#### After
```typescript
export const User = defineModel({
  scopes: {
    testMe: () => User.addScope({
      attributes: ['id', 'name'], // With type annotation
      where: {
        id: 2
      },
    }),
  },
});
```
What amazing things will happen next?
<br>
![](https://github.com/qoq-ts/qoq-sequelize/blob/master/images/scope-1.png?raw=true)

### Associations
#### Before
```typescript
// Project.ts
export const Project = defineModel('Project', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
  },
  user_id: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataType.STRING,
    allowNull: false,
  }
});

// User.ts
export const User = defineModel('User', {});

User.hasMany(Project, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  as: 'projects',
});
```
#### After
```typescript
// Project.ts
export const Project = defineModel({
  attributes: {
    id: column.int.primaryKey().autoIncrement(),
    user_id: column.int.notNull(),
    title: column.varChar.notNull(),
  },
});

// User.ts
export const User = defineModel({
  associations: {
    projects: () => User.hasMany(Project, {
      sourceKey: 'id',
      foreignKey: 'user_id',
    }),
  },
});
```
What amazing things will happen next?
<br>
![](https://github.com/qoq-ts/qoq-sequelize/blob/master/images/association-1.png?raw=true)
![](https://github.com/qoq-ts/qoq-sequelize/blob/master/images/association-2.png?raw=true)
![](https://github.com/qoq-ts/qoq-sequelize/blob/master/images/association-3.png?raw=true)

### BelongsToMany
```typescript
// UserProject.ts
export const UserProject = defineModel({
  attributes: {
    user_id: column.int.notNull(),
    project_id: column.int.notNull(),
  }
});

// User.ts
export const User = defineModel({
  associations: {
    projects: () => User.belongsToMany(Project, {
      through: UserProject,
      otherKey: 'project_id',
    }),
  },
});
```
What amazing things will happen next?
<br>
![](https://github.com/qoq-ts/qoq-sequelize/blob/master/images/belongsToMany.png?raw=true)
