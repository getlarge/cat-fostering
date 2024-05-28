import { applyDecorators } from '@nestjs/common';
import { Expose, plainToClass, Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import { existsSync, readFileSync } from 'node:fs';
import type { IsURLOptions } from 'validator';

const SecretValue = (options?: { isOptional?: boolean }) => {
  return applyDecorators(
    Expose(),
    Transform(({ obj, key }) => {
      const value = obj[key];
      if (!!value && typeof value === 'string' && existsSync(value)) {
        return readFileSync(value, 'utf-8').trim();
      }
      return value;
    }),
    IsString(),
    ...[options?.isOptional ? IsOptional() : undefined].filter(Boolean)
  );
};

const urlOptions = {
  require_protocol: true,
  require_valid_protocol: true,
  require_host: true,
  require_tld: false,
} satisfies IsURLOptions;

export class EnvironmentVariables {
  @Expose()
  @IsNumber()
  PORT?: number = 3000;

  @Expose()
  @IsUrl({
    protocols: ['postgres', 'postgresql'],
    require_valid_protocol: true,
    require_tld: false,
  })
  POSTGRES_URL?: string = 'postgres://localhost:5432/cat_fostering';

  @Expose()
  @IsString()
  @IsOptional()
  POSTGRES_USER?: string = null;

  @SecretValue({ isOptional: true })
  POSTGRES_PASSWORD?: string = null;

  @Expose()
  @IsString()
  @IsOptional()
  POSTGRES_DB?: string = null;

  @Expose()
  @IsUrl(urlOptions)
  ORY_KETO_ADMIN_URL?: string = 'http://localhost:4467';

  @Expose()
  @IsUrl(urlOptions)
  ORY_KETO_PUBLIC_URL?: string = 'http://localhost:4466';

  @SecretValue({ isOptional: true })
  ORY_KETO_API_KEY?: string = null;

  @Expose()
  @IsUrl(urlOptions)
  @IsOptional()
  ORY_KRATOS_ADMIN_URL?: string = 'http://localhost:4434';

  @Expose()
  @IsUrl(urlOptions)
  @IsOptional()
  ORY_KRATOS_PUBLIC_URL?: string = 'http://localhost:4433';

  @SecretValue({ isOptional: true })
  ORY_KRATOS_API_KEY?: string = null;

  @SecretValue()
  ORY_ACTION_API_KEY: string;

  /**
   * @see tools/ory/mappings.ts
   */
  @Expose()
  @IsString()
  @IsOptional()
  ORY_SESSION_COOKIE_NAME?: string = 'ory_kratos_session';
}

export function validateEnvironmentVariables(
  processEnv: Record<string, unknown>
) {
  const config = Object.fromEntries(
    Object.entries(processEnv).filter(
      ([, val]) => !!val && val !== 'null' && val !== 'undefined'
    )
  );

  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
    whitelist: true,
    validationError: {
      target: false,
    },
  });

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
  }
  return validatedConfig;
}
