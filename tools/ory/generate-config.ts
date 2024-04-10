import yargs from 'yargs';
import {
  generateOryKratosConfig,
  generateOryKetoConfig,
  updateOryNetworkConfig,
} from './helpers';

interface BaseOptions {
  envFile?: string;
}

async function main() {
  await yargs(process.argv.slice(2))
    .options({
      envFile: {
        description: 'Path to .env file',
        demandOption: false,
        example: 'infra/ory-kratos/.env',
        alias: 'e',
        type: 'string',
      },
    })
    .command({
      command: 'kratos',
      describe: 'Command to generate Kratos config from template',
      handler: (
        argv: yargs.ArgumentsCamelCase<
          BaseOptions & {
            _: ['kratos'];
          }
        >
      ) => {
        const { envFile } = argv;
        generateOryKratosConfig(envFile);
      },
    })
    .command({
      command: 'keto',
      describe: 'Command to generate Keto config from template',
      handler: (
        argv: yargs.ArgumentsCamelCase<
          BaseOptions & {
            _: ['keto'];
          }
        >
      ) => {
        const { envFile } = argv;
        generateOryKetoConfig(envFile);
      },
    })
    .command({
      command: 'network',
      describe: 'Command to generate and update Ory network config',
      builder: {
        projectId: {
          alias: 'p',
          description: 'Ory Network project ID',
          type: 'string',
        },
      },
      handler: (
        argv: yargs.ArgumentsCamelCase<
          BaseOptions & {
            _: ['network'];
            projectId: string;
          }
        >
      ) => {
        updateOryNetworkConfig(argv.projectId, argv.envFile);
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
