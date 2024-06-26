import { execSync } from 'node:child_process';

const cwd = process.cwd();

export const restartService = (service: string): void => {
  execSync(`docker compose -p cat-fostering restart ${service}`, {
    cwd,
    stdio: 'ignore',
  });
};
