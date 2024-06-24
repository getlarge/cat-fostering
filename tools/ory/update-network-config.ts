import { updateOryNetworkConfig } from '@cat-fostering/ory-config-generators';
import { parseArgs } from 'node:util';

const options = {
  envFile: {
    description: 'Path to .env file',
    default: '.env.staging',
    short: 'e',
    type: 'string',
  },
  projectId: {
    description: 'Ory Project ID',
    short: 'p',
    type: 'string',
  },
} as const;

const { values } = parseArgs({ options });
updateOryNetworkConfig(values.projectId, values.envFile);
