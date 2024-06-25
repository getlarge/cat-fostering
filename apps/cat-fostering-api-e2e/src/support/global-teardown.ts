import { registerTsProject } from '@nx/js/src/internal';
const cleanupRegisteredPaths = registerTsProject('../../tsconfig.base.json');

import {
  generateOryKetoConfig,
  generateOryKratosConfig,
} from '@cat-fostering/ory-config-generators';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

const cwd = process.cwd();
const dockerEnvPath = join(__dirname, '..', '..', '..', '..', '.env');

export default async (): Promise<void> => {
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  await (globalThis.__DB_CONNECTION__ as DataSource)?.destroy();

  if (process.env.CI) {
    return;
  }
  generateOryKetoConfig(dockerEnvPath);
  execSync('docker compose restart keto', { cwd, stdio: 'ignore' });

  generateOryKratosConfig(dockerEnvPath);
  execSync('docker compose restart kratos', { cwd, stdio: 'ignore' });
};

cleanupRegisteredPaths();
