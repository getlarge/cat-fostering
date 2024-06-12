import 'reflect-metadata';
import {
  ClassConstructor,
  Expose,
  Transform,
  plainToClass,
} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
  validateSync,
} from 'class-validator';

export class KeywordMappings {
  @Expose()
  @IsOptional()
  @IsString()
  log_level?: string = 'debug';

  [key: string]: (string | number)[] | string | number | boolean;
}

const isUrlOptions: Parameters<typeof IsUrl>[0] = {
  require_tld: false,
  require_protocol: true,
  require_valid_protocol: true,
  protocols: ['http', 'https'],
};

const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const DEFAULT_SELF_SERVICE_UI_URL = 'http://localhost:4455';

const strToBool = (value: string | boolean) =>
  value === 'true' || value === true;

export class KratosMappings extends KeywordMappings {
  @Expose()
  @IsOptional()
  @IsString()
  kratos_cookies_domain?: string = 'localhost';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_courier_smtp_from_name?: string = 'CatFostering';

  @Expose()
  @IsOptional()
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['smtp', 'smtps'],
  })
  kratos_courier_smtp_connection_uri?: string = undefined;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_dsn?: string = 'memory';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_identity_schemas_default?: string =
    'file:///etc/config/kratos/identity.schema.json';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_log_level?: string = 'debug';

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_errors_ui_url?: string = `${DEFAULT_SELF_SERVICE_UI_URL}/error`;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_settings_ui_url?: string = `${DEFAULT_SELF_SERVICE_UI_URL}/settings`;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_verification_ui_url?: string = `${DEFAULT_SELF_SERVICE_UI_URL}/verification`;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_recovery_ui_url?: string = `${DEFAULT_SELF_SERVICE_UI_URL}/recovery`;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_login_ui_url?: string = `${DEFAULT_SELF_SERVICE_UI_URL}/login`;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_login_default_browser_return_url?: string =
    DEFAULT_SELF_SERVICE_UI_URL;

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_flows_login_after_hook_config_can_interrupt?: boolean =
    false;

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_flows_login_after_hook_config_response_ignore?: boolean =
    false;

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_flows_login_after_hook_config_response_parse?: boolean =
    false;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_logout_default_browser_return_url?: string =
    DEFAULT_SELF_SERVICE_UI_URL;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_registration_ui_url?: string = `${DEFAULT_SELF_SERVICE_UI_URL}/register`;

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_flows_registration_after_hook_config_can_interrupt?: boolean =
    false;

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_flows_registration_after_hook_config_response_ignore?: boolean =
    false;

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_flows_registration_after_hook_config_response_parse?: boolean =
    false;

  @Expose()
  @IsOptional()
  @Transform(
    ({ value }) => (value ? value.split(',').map((v) => v.trim()) : []),
    { toClassOnly: true }
  )
  @IsArray()
  @IsString({ each: true })
  kratos_selfservice_allowed_return_urls?: string[] = [];

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_default_browser_return_url?: string;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_login_after_hook_config_url?: string;

  @Expose()
  @IsOptional()
  @IsIn(httpMethods)
  kratos_selfservice_flows_login_after_hook_config_method?: string = 'POST';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_flows_login_after_hook_config_body?: string =
    'file:///etc/config/kratos/after-webhook.jsonnet';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_flows_login_after_hook_config_auth_config_value?: string;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_settings_after_hook_config_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_flows_settings_after_hook_config_body?: string =
    'file:///etc/config/kratos/after-webhook.jsonnet';

  @Expose()
  @IsOptional()
  @IsIn(httpMethods)
  kratos_selfservice_flows_settings_after_hook_config_method?: string = 'POST';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_flows_settings_after_hook_config_auth_config_value?: string;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_registration_after_hook_config_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_flows_registration_after_hook_config_body?: string =
    'file:///etc/config/kratos/after-webhook.jsonnet';

  @Expose()
  @IsOptional()
  @IsIn(httpMethods)
  kratos_selfservice_flows_registration_after_hook_config_method?: string =
    'POST';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_flows_registration_after_hook_config_auth_config_value?: string;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_flows_verification_after_hook_config_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_flows_verification_after_hook_config_auth_config_value?: string;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_selfservice_methods_oidc_config_base_redirect_uri?: string =
    'http://localhost:4433/';

  /**
   * When enabled, a redirect to the following URL will be performed after the user has signed in with the social sign-in provider.
   * http(s)://<domain-of-ory-kratos>:<public-port>/self-service/methods/oidc/callback/<kratos_selfservice_methods_oidc_config_providers_0_id>
   */
  @Expose()
  @IsString()
  @ValidateIf(
    (object) =>
      object['kratos_selfservice_methods_oidc_enabled'] === true ||
      object['kratos_selfservice_methods_oidc_enabled'] === 'true'
  )
  kratos_selfservice_methods_oidc_config_providers_0_id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_methods_oidc_config_providers_0_client_id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_methods_oidc_config_providers_0_client_secret?: string;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_methods_oidc_config_providers_0_mapper_url?: string;

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_methods_oidc_enabled?: boolean = false;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_methods_passkey_config_rp_id?: string;

  @Expose()
  @IsOptional()
  @Transform(
    ({ value }) => (value ? value.split(',').map((v) => v.trim()) : []),
    { toClassOnly: true }
  )
  @IsArray()
  @IsUrl(isUrlOptions, { each: true })
  kratos_selfservice_methods_passkey_config_rp_origins?: string[] = [];

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_methods_passkey_enabled?: boolean = false;

  @Expose()
  @IsOptional()
  @IsString()
  kratos_selfservice_methods_webauthn_config_rp_id?: string;

  @Expose()
  @IsOptional()
  @Transform(
    ({ value }) => (value ? value.split(',').map((v) => v.trim()) : []),
    { toClassOnly: true }
  )
  @IsArray()
  @IsUrl(isUrlOptions, { each: true })
  kratos_selfservice_methods_webauthn_config_rp_origins?: string[] = [];

  @Expose()
  @Transform(({ obj, key }) => strToBool(obj[key]), {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_selfservice_methods_webauthn_enabled?: boolean = false;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(16)
  kratos_secrets_cookie?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(32, 32)
  kratos_secrets_cipher?: string;

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_serve_public_base_url?: string = 'http://localhost:4433/';

  @Expose()
  @Transform(({ obj, key }) => obj[key] === 'true' || obj[key] === true, {
    toClassOnly: true,
  })
  @IsOptional()
  @IsBoolean()
  kratos_serve_public_cors_enabled?: boolean = false;

  @Expose()
  @Transform(
    ({ value }) => (value ? value.split(',').map((v) => v.trim()) : []),
    { toClassOnly: true }
  )
  @IsOptional()
  @IsString({ each: true })
  kratos_serve_public_cors_allowed_origins?: string[] = [
    'http://localhost:4200',
    'http://localhost:4433',
    'http://localhost:4455',
    'http://localhost:8080',
  ];

  @Expose()
  @IsOptional()
  @IsUrl(isUrlOptions)
  kratos_serve_admin_base_url?: string = 'http://kratos:4434/';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_session_cookie_domain?: string = 'localhost';

  @Expose()
  @IsOptional()
  @IsString()
  kratos_session_cookie_name?: string = 'ory_kratos_session';
}

export class KetoMappings extends KeywordMappings {
  @Expose()
  @IsOptional()
  @IsString()
  keto_dsn?: string = 'memory';

  @Expose()
  @IsOptional()
  @IsString()
  keto_log_level?: string = 'debug';

  @Expose()
  @IsOptional()
  @IsString()
  keto_namespaces_location?: string = 'file:///home/ory/namespaces.ts';
}

export function validateMappings<T extends object>(
  mappings: ClassConstructor<T>,
  processEnv: Record<string, string>
) {
  const validatedConfig = plainToClass(mappings, processEnv, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
    exposeUnsetFields: false,
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
