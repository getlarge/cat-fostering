import { execSync } from 'node:child_process';
import { DataSource } from 'typeorm';

const cwd = process.cwd();

export default async (): Promise<void> => {
  console.log(globalThis.__TEARDOWN_MESSAGE__);

  await (globalThis.__DB_CONNECTION__ as DataSource)?.destroy();

  execSync(
    'npx ts-node --project tools/tsconfig.json tools/ory/generate-config.ts keto -e .env',
    { cwd, stdio: 'ignore' }
  );
  execSync('docker compose restart keto', { cwd, stdio: 'ignore' });
  execSync(
    'npx ts-node --project tools/tsconfig.json tools/ory/generate-config.ts kratos -e .env',
    { cwd, stdio: 'ignore' }
  );
  execSync('docker compose restart kratos', { cwd, stdio: 'ignore' });
};
