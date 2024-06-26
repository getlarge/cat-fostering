/**
 * this is a workaround since the TS environment is not yet loaded in the global setup hook
 * @see https://stackoverflow.com/questions/48318230/configure-jest-global-tests-setup-with-ts-file
 * not needed when using `import { registerTsProject } from '@nx/js/src/internal';`
 **/
// import * as tsConfigPaths from 'tsconfig-paths';
// tsConfigPaths.register({
//   baseUrl: './',
//   paths: {
//     '@cat-fostering/entities': ['libs/shared/entities/src/index.ts'],
//   },
// });

import {
  CatProfileSchema,
  FosteringSchema,
  UserSchema,
} from '@cat-fostering/entities';
import { config, parse } from 'dotenv';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';

const cwd = process.cwd();

const getConnectionOptions = (envFilePath = '.env.test') => {
  const variables = existsSync(envFilePath)
    ? parse(readFileSync(envFilePath))
    : {};
  const env = config({ path: resolve(envFilePath) });
  const { parsed, error } = env;
  const source = error
    ? { ...process.env, ...variables }
    : { ...parsed, ...variables };

  const database = source['POSTGRES_DB'];
  const username = source['POSTGRES_USER'];
  const password = source['POSTGRES_PASSWORD'];
  const url = new URL(source['POSTGRES_URL']);
  url.username = username || url.username;
  url.password = password || url.password;
  url.pathname = database ? `/${database}` : url.pathname;
  return {
    type: 'postgres',
    url: url.toString(),
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [UserSchema, CatProfileSchema, FosteringSchema],
  } satisfies Partial<DataSourceOptions>;
};

export const createTestConnection = async (envFilePath = '.env.test') => {
  const options = getConnectionOptions(envFilePath);
  const urlObject = new URL(options.url);
  const database = urlObject.pathname.replace('/', '');
  const username = urlObject.username;
  try {
    const conn = await new DataSource(options).initialize();
    await conn.dropDatabase();
    return conn;
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.warn(`Creating database ${database}...`);
      const mainDatababase = 'postgres';
      const adminConn = await new DataSource({
        ...options,
        url: options.url.replace(database, mainDatababase),
      }).initialize();
      await adminConn.query(`CREATE DATABASE ${database}`);
      await adminConn.query(
        `GRANT ALL PRIVILEGES ON DATABASE ${database} TO ${username}`
      );
      await adminConn.destroy();
      return new DataSource(options).initialize();
    }
    throw error;
  }
};

export const restartService = (service: string): void => {
  execSync(`docker compose -p cat-fostering restart ${service}`, {
    cwd,
    stdio: 'ignore',
  });
};
