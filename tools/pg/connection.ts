/**
 * this is a workaround since the TS environment is not yet loaded in the global setup hook
 * @see https://stackoverflow.com/questions/48318230/configure-jest-global-tests-setup-with-ts-file
 **/
// import * as tsConfigPaths from 'tsconfig-paths';
// tsConfigPaths.register({
//   baseUrl: './',
//   paths: {
//     '@cat-fostering/entities': ['libs/shared/entities/src/index.ts'],
//     '@cat-fostering/pg-config': ['libs/pg-config/src/index.ts'],
//   },
// });

import { createTestConnection } from '@cat-fostering/pg-config';
import { resolve } from 'node:path';
import yargs from 'yargs';

interface BaseOptions {
  envFile?: string;
}

async function main() {
  await yargs(process.argv.slice(2))
    .options({
      envFile: {
        description: 'Path to .env file',
        demandOption: false,
        example: '.env',
        alias: 'e',
        type: 'string',
      },
    })
    .command({
      command: 'create',
      describe: 'Command to create a PG connection',
      handler: async (
        argv: yargs.ArgumentsCamelCase<
          BaseOptions & {
            _: ['create'];
          }
        >
      ) => {
        await createTestConnection(resolve(argv.envFile));
      },
    })
    .demandCommand(1, 'A valid command must be provided')
    .fail((msg, err) => {
      if (err) throw err;
      throw new Error(msg);
    }).argv;
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
