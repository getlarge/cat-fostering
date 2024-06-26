import * as dotenvX from '@dotenvx/dotenvx';
import type { ClassConstructor } from 'class-transformer';
import { dump, load } from 'js-yaml';
import { execSync } from 'node:child_process';
import { accessSync, constants, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { inspect } from 'node:util';

import {
  KetoMappings,
  KeywordMappings,
  KratosMappings,
  validateMappings,
} from './mappings';

export const INFRA_DIRECTORY =
  process.env['ORY_INFRA_DIRECTORY'] ??
  join(__dirname, '..', '..', '..', '..', 'infra');
export const ORY_KRATOS_DIRECTORY = join(INFRA_DIRECTORY, 'ory-kratos');
export const ORY_KETO_DIRECTORY = join(INFRA_DIRECTORY, 'ory-keto');
export const ORY_NETWORK_DIRECTORY = join(INFRA_DIRECTORY, 'ory-network');

type ConfigFilepath = `${string}.yml` | `${string}.yaml` | `${string}.json`;

function keywordArrayReplace(input: string, mappings: KeywordMappings) {
  Object.keys(mappings).forEach(function (key) {
    // Matching against two sets of patterns because a developer may provide their array replacement keyword with or without wrapping quotes. It is not obvious to the developer which to do depending if they're operating in YAML or JSON.
    const pattern = `@@${key}@@`;
    const patternWithQuotes = `"${pattern}"`;
    const regex = new RegExp(`${patternWithQuotes}|${pattern}`, 'g');
    // eslint-disable-next-line no-param-reassign
    input = input.replace(regex, JSON.stringify(mappings[key]));
  });
  return input;
}

function keywordStringReplace(input: string, mappings: KeywordMappings) {
  Object.keys(mappings).forEach(function (key) {
    const regex = new RegExp(`##${key}##`, 'g');
    const mapping = mappings[key];
    if (
      typeof mapping === 'string' ||
      typeof mapping === 'number' ||
      typeof mapping === 'boolean'
    ) {
      // eslint-disable-next-line no-param-reassign
      input = input.replace(regex, mapping.toString());
    } else {
      // eslint-disable-next-line no-param-reassign
      input = input.replace(regex, '');
    }
  });
  return input;
}
function keywordReplace(input: string, mappings: KeywordMappings) {
  // Replace keywords with mappings within input.
  if (mappings && Object.keys(mappings).length > 0) {
    // eslint-disable-next-line no-param-reassign
    input = keywordArrayReplace(input, mappings);
    // eslint-disable-next-line no-param-reassign
    input = keywordStringReplace(input, mappings);
  }
  return input;
}

export function loadFileAndReplaceKeywords(
  file: ConfigFilepath,
  mappings?: KeywordMappings
) {
  const f = resolve(file);
  try {
    accessSync(f, constants.F_OK);
    if (mappings) {
      return keywordReplace(readFileSync(f, 'utf8'), mappings);
    }
    return readFileSync(f, 'utf8');
  } catch (error) {
    throw new Error(`Unable to load file ${f} due to ${error}`);
  }
}

export function getOryConfig<M extends KeywordMappings>(
  configFilepath: ConfigFilepath,
  mappings?: M
): Record<string, unknown> {
  const oryConfigString = loadFileAndReplaceKeywords(configFilepath, mappings);
  if (configFilepath.endsWith('.json')) {
    return JSON.parse(oryConfigString);
  }
  return load(oryConfigString) as Record<string, unknown>;
}

function getOryMappings<T extends KeywordMappings>(
  cls: ClassConstructor<T>,
  envFilePath: string
): T {
  const oldProcessEnv = structuredClone(process.env);
  // const keys = Object.keys(plainToInstance(cls, {}));
  const result = dotenvX.config({ path: envFilePath, overload: true });
  process.env = { ...oldProcessEnv };
  if (!result.parsed) {
    throw new Error(`Unable to parse env file ${envFilePath}`);
  }
  return validateMappings(cls, result.parsed);
}

export function getOryKratosMappings(envFilePath: string): KratosMappings {
  return getOryMappings(KratosMappings, envFilePath);
}

export function getOryKetoMappings(envFilePath: string): KetoMappings {
  return getOryMappings(KetoMappings, envFilePath);
}

function storeGeneratedOryConfig(
  config: Record<string, unknown>,
  outputFilePath: ConfigFilepath
): string {
  let output: string;
  if (outputFilePath.endsWith('.json')) {
    output = JSON.stringify(config, null, 2);
  } else {
    output = dump(config, {
      lineWidth: 120,
      noRefs: true,
      sortKeys: true,
      quotingType: '"',
    });
  }
  writeFileSync(outputFilePath, output);
  return output;
}

export function generateOryKratosConfig(
  envFilePath: string = join(ORY_KRATOS_DIRECTORY, '.env'),
  outputFilePath: ConfigFilepath = join(
    ORY_KRATOS_DIRECTORY,
    'kratos.yaml'
  ) as ConfigFilepath,
  configFilepath: ConfigFilepath = join(
    ORY_KRATOS_DIRECTORY,
    'kratos-template.yaml'
  ) as ConfigFilepath
): string {
  const mappings = getOryKratosMappings(envFilePath);
  const config = getOryConfig(configFilepath, mappings);
  return storeGeneratedOryConfig(config, outputFilePath);
}

export function generateOryKetoConfig(
  envFilePath: string = join(ORY_KETO_DIRECTORY, '.env'),
  outputFilePath: ConfigFilepath = join(
    ORY_KETO_DIRECTORY,
    'keto.yaml'
  ) as ConfigFilepath,
  configFilepath: ConfigFilepath = join(
    ORY_KETO_DIRECTORY,
    'keto-template.yaml'
  ) as ConfigFilepath
): string {
  const mappings = getOryKetoMappings(envFilePath);
  const config = getOryConfig(configFilepath, mappings);
  return storeGeneratedOryConfig(config, outputFilePath);
}

type OryNetworkConfig = {
  name: string;
  services: {
    identity: {
      config: Record<string, unknown>;
    };
    permission: {
      config: Record<string, unknown>;
    };
  };
};

/**
 * @description create input for ory update project <your-project-id> --file config.yaml command
 * @see https://www.ory.sh/docs/guides/cli/config-with-cli#overwrite--import-configuration
 */
export function generateOryNetworkConfig(envFile: string) {
  const kratosConfigFilePath = join(
    ORY_NETWORK_DIRECTORY,
    'identity.yaml'
  ) as ConfigFilepath;
  const ketoConfigFilePath = join(
    ORY_NETWORK_DIRECTORY,
    'permission.yaml'
  ) as ConfigFilepath;

  generateOryKetoConfig(envFile, ketoConfigFilePath);
  generateOryKratosConfig(envFile, kratosConfigFilePath);

  const oryConfig: OryNetworkConfig = {
    name: 'CatFostering',
    services: {
      identity: {
        config: getOryConfig(kratosConfigFilePath),
      },
      permission: {
        config: getOryConfig(ketoConfigFilePath),
      },
    },
  };
  return oryConfig;
}

export function updateOryNetworkConfig(projectId: string, envFile: string) {
  const oryConfig = generateOryNetworkConfig(envFile);
  console.log(inspect(oryConfig, { depth: null }));
  const oryNetworkConfigPath = join(ORY_NETWORK_DIRECTORY, 'config.json');
  writeFileSync(oryNetworkConfigPath, JSON.stringify(oryConfig));
  execSync(
    `ory update project ${projectId} --format json --file ${oryNetworkConfigPath}`,
    {
      stdio: 'inherit',
    }
  );
}
