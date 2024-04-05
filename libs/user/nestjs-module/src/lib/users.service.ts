import { UserSchema } from '@cat-fostering/entities';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { inspect } from 'node:util';
import type { Repository } from 'typeorm';

import { OnOrySignInDto } from './models/ory-sign-in.dto';
import { OnOrySignUpDto } from './models/ory-sign-up.dto';

@Injectable()
export class UsersService {
  readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserSchema) private userRepository: Repository<UserSchema>
  ) {}

  async onSignUp(body: OnOrySignUpDto): Promise<OnOrySignUpDto> {
    this.logger.debug(
      inspect(body, {
        showHidden: false,
        depth: null,
      }),
      'onSignUp'
    );
    const { email } = body.identity.traits;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new HttpException('email already used', HttpStatus.BAD_REQUEST);
    }
    const result = await this.userRepository.save({ email, name: email });
    body.identity.metadata_public = { id: result.id };
    return { identity: body.identity };
  }

  // TODO: throw error in format supported by Ory hooks response handler + create specific error class
  async onSignIn(body: OnOrySignInDto): Promise<OnOrySignInDto> {
    const { identity } = body;
    this.logger.debug(
      inspect(body, {
        showHidden: false,
        depth: null,
      }),
      'onSignIn'
    );
    const email = identity.traits.email;
    const userId = identity.metadata_public?.id;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        email,
      },
    });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    if (!identity.verifiable_addresses?.length) {
      // this means the identity schema does not require email verification
      return { identity };
    }
    const hasAddressVerified = identity.verifiable_addresses.some(
      (address) => address.verified
    );
    if (!hasAddressVerified) {
      throw new HttpException('Email not verified', HttpStatus.UNAUTHORIZED);
    }
    return { identity };
  }
}
