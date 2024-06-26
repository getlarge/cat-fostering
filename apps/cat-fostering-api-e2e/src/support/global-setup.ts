import { registerTsProject } from '@nx/js/src/internal';
const cleanupRegisteredPaths = registerTsProject('../../tsconfig.base.json');

import {
  generateOryKetoConfig,
  generateOryKratosConfig,
} from '@cat-fostering/ory-config-generators';
import { createTestConnection } from '@cat-fostering/pg-config';
import { join } from 'node:path';

import { restartService } from './helpers';

const applicationEnvPath = join(
  __dirname,
  '..',
  '..',
  '..',
  'cat-fostering-api',
  '.env.ci'
);
const dockerEnvPath = join(__dirname, '..', '..', '..', '..', '.env.ci');

export default async (): Promise<void> => {
  console.log('\nSetting up...\n');
  const __TEARDOWN_MESSAGE__ = '\nTearing down...\n';
  globalThis.__TEARDOWN_MESSAGE__ = __TEARDOWN_MESSAGE__;

  console.log({
    CI: process.env.CI,
    ACT: process.env.ACT,
    NX_TASK_TARGET_TARGET: process.env.NX_TASK_TARGET_TARGET,
  });

  if (
    process.env.CI ||
    process.env.ACT ||
    // unfortunately, the task generated for tests splitting do not contain the target name
    process.env.NX_TASK_TARGET_TARGET?.includes('e2e-ci')
  ) {
    return;
  }

  if (process.env.NX_TASK_TARGET_TARGET === 'e2e') {
    generateOryKetoConfig(dockerEnvPath);
    restartService('keto');
    generateOryKratosConfig(dockerEnvPath);
    restartService('kratos');
    globalThis.__DB_CONNECTION__ = await createTestConnection(
      applicationEnvPath
    );
    restartService('api');
  }
};

cleanupRegisteredPaths();
