import { Expose, plainToClass } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

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
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    require_host: true,
    require_tld: false,
  })
  ORY_KETO_ADMIN_URL?: string = 'http://localhost:4467';

  @Expose()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    require_host: true,
    require_tld: false,
  })
  ORY_KETO_PUBLIC_URL?: string = 'http://localhost:4466';

  @Expose()
  @IsString()
  @IsOptional()
  ORY_KETO_API_KEY?: string = null;

  @Expose()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    require_host: true,
    require_tld: false,
  })
  @IsOptional()
  ORY_KRATOS_ADMIN_URL?: string = 'http://localhost:4434';

  @Expose()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    require_host: true,
    require_tld: false,
  })
  @IsOptional()
  ORY_KRATOS_PUBLIC_URL?: string = 'http://localhost:4433';

  @Expose()
  @IsString()
  @IsOptional()
  ORY_KRATOS_API_KEY?: string = null;
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
