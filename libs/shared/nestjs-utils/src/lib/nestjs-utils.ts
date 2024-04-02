import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Session } from '@ory/client';
import type { Request } from 'express';

export function getCurrentUser<U = unknown>(request: Request & { user: U }): U {
  return request['user'];
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: unknown }>();
    return getCurrentUser(request);
  }
);

export function isValidOrySession(x: unknown): x is Session & {
  identity: Session['identity'] & {
    traits: { email: string; username: string };
    metadata_public: { id: string };
  };
} {
  return (
    typeof x === 'object' &&
    !!x &&
    'id' in x &&
    typeof x.id === 'string' &&
    'identity' in x &&
    typeof x.identity === 'object' &&
    !!x.identity &&
    'traits' in x.identity &&
    typeof x.identity.traits === 'object' &&
    !!x.identity.traits &&
    'email' in x.identity.traits &&
    'metadata_public' in x.identity &&
    typeof x.identity.metadata_public === 'object' &&
    !!x.identity.metadata_public &&
    'id' in x.identity.metadata_public &&
    typeof x.identity.metadata_public.id === 'string'
  );
}
