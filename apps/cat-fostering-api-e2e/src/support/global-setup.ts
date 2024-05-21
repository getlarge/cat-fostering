import { execSync } from 'node:child_process';

import { createTestConnection } from './helpers';

const envPath = 'apps/cat-fostering-api/.env.ci';

const cwd = process.cwd();

export default async (): Promise<void> => {
  console.log('\nSetting up...\n');

  const __TEARDOWN_MESSAGE__ = '\nTearing down...\n';
  globalThis.__TEARDOWN_MESSAGE__ = __TEARDOWN_MESSAGE__;

  execSync(
    'npx ts-node --project tools/tsconfig.json tools/ory/generate-config.ts keto -e .env.ci',
    { cwd, stdio: 'ignore' }
  );
  execSync('docker compose restart keto', { cwd, stdio: 'ignore' });
  execSync(
    'npx ts-node --project tools/tsconfig.json tools/ory/generate-config.ts kratos -e .env.ci',
    { cwd, stdio: 'ignore' }
  );
  execSync('docker compose restart kratos', { cwd, stdio: 'ignore' });

  globalThis.__DB_CONNECTION__ = await createTestConnection(envPath);
};
