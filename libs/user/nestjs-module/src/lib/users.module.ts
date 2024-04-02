import {
  CatProfileSchema,
  FosteringSchema,
  UserSchema,
} from '@cat-fostering/entities';
import { OryFrontendModule } from '@getlarge/kratos-client-wrapper';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    OryFrontendModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: unknown) => ({
        basePath: (
          configService as ConfigService<
            { ORY_KRATOS_PUBLIC_URL: string },
            true
          >
        ).get('ORY_KRATOS_PUBLIC_URL'),
      }),
    }),
    TypeOrmModule.forFeature([UserSchema, CatProfileSchema, FosteringSchema]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
