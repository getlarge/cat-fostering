/**
 * this is a workaround since the TS environment is not yet loaded in the global setup hook
 * @see https://stackoverflow.com/questions/48318230/configure-jest-global-tests-setup-with-ts-file
 **/
import * as tsConfigPaths from 'tsconfig-paths';
tsConfigPaths.register({
  baseUrl: './',
  paths: {
    '@cat-fostering/entities': ['libs/shared/entities/src/index.ts'],
  },
});

import {
  CatProfileSchema,
  FosteringSchema,
  UserSchema,
} from '@cat-fostering/entities';
import { config, parse } from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const createTestConnection = async (envFilePath = '.env.test') => {
  const variables = existsSync(envFilePath)
    ? parse(readFileSync(envFilePath))
    : {};
  const env = config({ path: resolve(envFilePath) });
  const { parsed, error } = env;
  const source = error
    ? { ...process.env, ...variables }
    : { ...parsed, ...variables };
  const options = {
    type: 'postgres',
    url: source.POSTGRES_URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    // entities: ['libs/shared/entities/src/lib/*.entities.ts'],
    entities: [UserSchema, CatProfileSchema, FosteringSchema],
  } satisfies Partial<DataSourceOptions>;
  const urlObject = new URL(options.url);
  const database = urlObject.pathname.replace('/', '');
  const username = urlObject.username;
  try {
    return await new DataSource(options).initialize();
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.warn(`Creating database ${database}...`);
      const mainDatababase = 'postgres';
      const adminConn = await new DataSource({
        ...options,
        url: source.POSTGRES_URL.replace(database, mainDatababase),
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
