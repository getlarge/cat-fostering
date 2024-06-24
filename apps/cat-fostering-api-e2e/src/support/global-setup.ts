import { registerTsProject } from '@nx/js/src/internal';
const cleanupRegisteredPaths = registerTsProject('../../tsconfig.base.json');

import {
  generateOryKetoConfig,
  generateOryKratosConfig,
} from '@cat-fostering/ory-config-generators';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

import { createTestConnection } from './helpers';

const applicationEnvPath = join(
  __dirname,
  '..',
  '..',
  '..',
  'cat-fostering-api/.env.ci'
);
const dockerEnvPath = join(__dirname, '..', '..', '..', '..', '.env.ci');

const cwd = process.cwd();

export default async (): Promise<void> => {
  console.log('\nSetting up...\n');

  const __TEARDOWN_MESSAGE__ = '\nTearing down...\n';
  globalThis.__TEARDOWN_MESSAGE__ = __TEARDOWN_MESSAGE__;

  generateOryKetoConfig(dockerEnvPath);
  execSync('docker compose restart keto', { cwd, stdio: 'ignore' });

  generateOryKratosConfig(dockerEnvPath);
  execSync('docker compose restart kratos', { cwd, stdio: 'ignore' });

  globalThis.__DB_CONNECTION__ = await createTestConnection(applicationEnvPath);
};

cleanupRegisteredPaths();
