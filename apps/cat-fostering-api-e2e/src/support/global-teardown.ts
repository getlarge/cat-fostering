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

  await (globalThis.__DB_CONNECTION__ as DataSource)?.destroy();

  if (process.env.CI && !process.env.ACT) {
    return;
  }
  generateOryKetoConfig(dockerEnvPath);
  restartService('keto');

  generateOryKratosConfig(dockerEnvPath);
  restartService('kratos');
};

cleanupRegisteredPaths();
