import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class OryActionGuard implements CanActivate {
  readonly logger = new Logger(OryActionGuard.name);
  private readonly apiKey: string;

  constructor(
    @Inject(ConfigService)
    configService: ConfigService<{ ORY_ACTION_API_KEY: string }, true>
  ) {
    this.apiKey = configService.get('ORY_ACTION_API_KEY');
  }

  /**
   * @description compare the api key from the request header with the api key from the environment variables
   * @see infra/ory-kratos/kratos-template.yaml
   */
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['x-ory-api-key'];
    return (
      authHeader &&
      timingSafeEqual(Buffer.from(authHeader), Buffer.from(this.apiKey))
    );
  }
}
