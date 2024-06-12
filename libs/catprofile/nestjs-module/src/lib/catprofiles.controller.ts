import { CatProfile } from '@cat-fostering/entities';
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
  Delete,
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
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { CatProfilesService } from './catprofiles.service';
import {
  isAdminPermission,
  isEditorPermission,
  isOwnerPermission,
} from './helpers';
import { CreateCatProfile } from './models/create-catprofile.dto';
import { UpdateCatProfile } from './models/update-catprofile.dto';

const AuthenticationGuard = (): Type<CanActivate> =>
  OryAuthenticationGuard({
    cookieResolver: (ctx) => ctx.switchToHttp().getRequest().headers.cookie,
    sessionTokenResolver: (ctx) =>
      ctx
        .switchToHttp()
        .getRequest()
        .headers?.authorization?.replace('Bearer', '')
        ?.trim(),
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

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('cat-profiles')
@Controller('cat-profiles')
export class CatProfilesController {
  constructor(private readonly catProfilesService: CatProfilesService) {}

  @UseGuards(AuthenticationGuard())
  @Get()
  find(): Promise<CatProfile[]> {
    return this.catProfilesService.find();
  }

  @UseGuards(AuthenticationGuard())
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() body: CreateCatProfile
  ): Promise<CatProfile> {
    return this.catProfilesService.create(body, user.id);
  }

  @UseGuards(AuthenticationGuard())
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<CatProfile> {
    return this.catProfilesService.findById(id);
  }

  @OryPermissionChecks({
    type: 'OR',
    conditions: [isOwnerPermission, isAdminPermission],
  })
  @UseGuards(AuthenticationGuard(), AuthorizationGuard())
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )
  @Patch(':id')
  updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCatProfile
  ): Promise<CatProfile> {
    return this.catProfilesService.updateById(id, body);
  }

  @OryPermissionChecks(isEditorPermission)
  @UseGuards(AuthenticationGuard(), AuthorizationGuard())
  @Delete(':id')
  deleteById(@Param('id', ParseUUIDPipe) id: string): Promise<{
    id: string;
  }> {
    return this.catProfilesService.deleteById(id);
  }
}
