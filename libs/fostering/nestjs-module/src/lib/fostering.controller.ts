import { Fostering } from '@cat-fostering/entities';
import { CurrentUser, isValidOrySession } from '@cat-fostering/nestjs-utils';
import {
  OryAuthorizationGuard,
  OryPermissionChecks,
} from '@getlarge/keto-client-wrapper';
import { OryAuthenticationGuard } from '@getlarge/kratos-client-wrapper';
import {
  Body,
  CanActivate,
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Type,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FosteringService } from './fostering.service';
import {
  canApproveFosteringPermission,
  canReadFosteringPermission,
  canRejectFosteringPermission,
  canRequestFosteringPermission,
} from './helpers';
import { RequestFostering } from './models/request-fostering';

const AuthenticationGuard = (): Type<CanActivate> =>
  OryAuthenticationGuard({
    cookieResolver: (ctx) => ctx.switchToHttp().getRequest().headers.cookie,
    sessionTokenResolver: (ctx) =>
      ctx
        .switchToHttp()
        .getRequest()
        .headers?.authorization?.replace('Bearer ', ''),
    postValidationHook: (ctx, session) => {
      if (!isValidOrySession(session)) {
        throw new HttpException(
          'Unauthorized',
          401,
          ctx.switchToHttp().getRequest().url
        );
      }
      const request = ctx.switchToHttp().getRequest();
      request.session = session;
      request.user = {
        id: session.identity.metadata_public['id'],
        email: session.identity.traits.email,
        identityId: session.identity.id,
      };
    },
    unauthorizedFactory(ctx) {
      return new HttpException(
        'Unauthorized',
        401,
        ctx.switchToHttp().getRequest().url
      );
    },
  });

const AuthorizationGuard = (): Type<CanActivate> =>
  OryAuthorizationGuard({
    unauthorizedFactory(ctx) {
      return new HttpException(
        'Forbidden',
        403,
        ctx.switchToHttp().getRequest().url
      );
    },
  });

@Controller('fostering')
export class FosteringController {
  constructor(private readonly fosteringService: FosteringService) {}

  @UseGuards(AuthenticationGuard())
  @Get()
  find(@CurrentUser() user: CurrentUser): Promise<Fostering[]> {
    return this.fosteringService.find(user.id);
  }

  @OryPermissionChecks(canRequestFosteringPermission)
  @UseGuards(AuthenticationGuard())
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )
  @Post()
  request(
    @CurrentUser() user: CurrentUser,
    @Body() body: RequestFostering
  ): Promise<Fostering> {
    return this.fosteringService.request(body, user.id);
  }

  @OryPermissionChecks(canReadFosteringPermission)
  @UseGuards(AuthenticationGuard(), AuthorizationGuard())
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<Fostering> {
    return this.fosteringService.findById(id);
  }

  @OryPermissionChecks(canApproveFosteringPermission)
  @UseGuards(AuthenticationGuard(), AuthorizationGuard())
  @Patch(':id/approve')
  approve(@Param('id', ParseUUIDPipe) id: string): Promise<Fostering> {
    return this.fosteringService.approve(id);
  }

  @OryPermissionChecks(canRejectFosteringPermission)
  @UseGuards(AuthenticationGuard(), AuthorizationGuard())
  @Patch(':id/reject')
  reject(@Param('id', ParseUUIDPipe) id: string): Promise<{
    id: string;
  }> {
    return this.fosteringService.reject(id);
  }
}
