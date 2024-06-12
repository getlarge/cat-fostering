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
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { OryActionGuard } from './guards/ory-action.guard';
import { validationErrorsToOryErrorMessages } from './helpers';
import { OnOrySignInDto } from './models/ory-sign-in.dto';
import { OnOrySignUpDto } from './models/ory-sign-up.dto';
import { OryWebhookError } from './models/ory-webhook.error';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiSecurity('ory-action')
  @UseGuards(OryActionGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        const formattedErrors = validationErrorsToOryErrorMessages(errors);
        return new OryWebhookError(
          'Failed to validate input',
          formattedErrors,
          400
        );
      },
    })
  )
  @Post('on-sign-up')
  @HttpCode(HttpStatus.OK)
  onSignUp(@Body() body: OnOrySignUpDto): Promise<OnOrySignUpDto> {
    return this.usersService.onSignUp(body);
  }

  @ApiSecurity('ory-action')
  @UseGuards(OryActionGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        const formattedErrors = validationErrorsToOryErrorMessages(errors);
        return new OryWebhookError(
          'Failed to validate input',
          formattedErrors,
          400
        );
      },
    })
  )
  @Post('on-sign-in')
  @HttpCode(HttpStatus.OK)
  onSignIn(@Body() body: OnOrySignInDto): Promise<OnOrySignInDto> {
    return this.usersService.onSignIn(body);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(
    OryAuthenticationGuard({
      cookieResolver: (ctx) =>
        ctx.switchToHttp().getRequest<Request>().headers.cookie ?? '',
      sessionTokenResolver: (ctx) =>
        ctx
          .switchToHttp()
          .getRequest<Request>()
          .headers?.authorization?.replace('Bearer', '')
          ?.trim() ?? '',
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
      unauthorizedFactory: (ctx, error) => {
        Logger.error(error);
        return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      },
    })
  )
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: User): User {
    return user;
  }
}
