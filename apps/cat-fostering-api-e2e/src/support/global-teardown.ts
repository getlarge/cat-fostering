import { registerTsProject } from '@nx/js/src/internal';
const cleanupRegisteredPaths = registerTsProject('../../tsconfig.base.json');

import {
  generateOryKetoConfig,
  generateOryKratosConfig,
} from '@cat-fostering/ory-config-generators';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

import { restartService } from './helpers';

const dockerEnvPath = join(__dirname, '..', '..', '..', '..', '.env');

export default async (): Promise<void> => {
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  if (
    process.env.CI ||
    process.env.ACT ||
    // unfortunately, the task generated for tests splitting do not contain the target name
    process.env.NX_TASK_TARGET_TARGET === 'e2e-ci'
  ) {
    return;
  }

  if (process.env.NX_TASK_TARGET_TARGET === 'e2e') {
    await (globalThis.__DB_CONNECTION__ as DataSource)?.destroy();
    generateOryKetoConfig(dockerEnvPath);
    restartService('keto');
    generateOryKratosConfig(dockerEnvPath);
    restartService('kratos');
  }
};

cleanupRegisteredPaths();
