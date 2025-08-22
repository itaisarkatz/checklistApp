import type { Knex } from 'knex';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'dev.sqlite3'),
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'db', 'migrations'),
    },
    useNullAsDefault: true,
  },
};

export default config;