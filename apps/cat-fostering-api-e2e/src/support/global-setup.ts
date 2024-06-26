import { registerTsProject } from '@nx/js/src/internal';
const cleanupRegisteredPaths = registerTsProject('../../tsconfig.base.json');

import {
  generateOryKetoConfig,
  generateOryKratosConfig,
} from '@cat-fostering/ory-config-generators';
import { join } from 'node:path';

import { createTestConnection, restartService } from './helpers';

const applicationEnvPath = join(
  __dirname,
  '..',
  '..',
  '..',
  'cat-fostering-api',
  '.env.ci'
);
const dockerEnvPath = join(__dirname, '..', '..', '..', '..', '.env.ci');

const cwd = process.cwd();

export default async (): Promise<void> => {
  console.log('\nSetting up...\n');

  const __TEARDOWN_MESSAGE__ = '\nTearing down...\n';
  globalThis.__TEARDOWN_MESSAGE__ = __TEARDOWN_MESSAGE__;

  generateOryKetoConfig(dockerEnvPath);
  restartService('keto');

  generateOryKratosConfig(dockerEnvPath);
  restartService('kratos');

  globalThis.__DB_CONNECTION__ = await createTestConnection(applicationEnvPath);
  restartService('api');
};

cleanupRegisteredPaths();
