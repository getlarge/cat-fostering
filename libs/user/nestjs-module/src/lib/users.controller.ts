import { User } from '@cat-fostering/entities';
import {
  CurrentUser,
  isValidOrySession,
  ValidOrySession,
} from '@cat-fostering/nestjs-utils';
import { OryAuthenticationGuard } from '@getlarge/kratos-client-wrapper';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { OryActionGuard } from './guards/ory-action.guard';
import { OnOrySignInDto } from './models/ory-sign-in.dto';
import { OnOrySignUpDto } from './models/ory-sign-up.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(OryActionGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    })
  )
  @Post('on-sign-up')
  @HttpCode(HttpStatus.OK)
  onSignUp(@Body() body: OnOrySignUpDto): Promise<OnOrySignUpDto> {
    return this.usersService.onSignUp(body);
  }

  @UseGuards(OryActionGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    })
  )
  @Post('on-sign-in')
  @HttpCode(HttpStatus.OK)
  onSignIn(@Body() body: OnOrySignInDto): Promise<OnOrySignInDto> {
    return this.usersService.onSignIn(body);
  }

  @UseGuards(
    OryAuthenticationGuard({
      cookieResolver: (ctx) =>
        ctx.switchToHttp().getRequest<Request>().headers.cookie ?? '',
      sessionTokenResolver: (ctx) =>
        ctx
          .switchToHttp()
          .getRequest<Request>()
          .headers?.authorization?.replace('Bearer ', '') ?? '',
      postValidationHook: (ctx, session) => {
        const request = ctx.switchToHttp().getRequest<
          Request & {
            session: ValidOrySession;
            user: {
              id: string;
              email: string;
              identityId: string;
            };
          }
        >();
        if (!isValidOrySession(session)) {
          throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
        }
        request.session = session;
        request.user = {
          id: session.identity.metadata_public['id'],
          email: session.identity.traits.email,
          identityId: session.identity.id,
        };
      },
    })
  )
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: User): User {
    return user;
  }
}
