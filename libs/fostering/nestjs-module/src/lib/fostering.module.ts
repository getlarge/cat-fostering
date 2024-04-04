import {
  CatProfileSchema,
  FosteringSchema,
  UserSchema,
} from '@cat-fostering/entities';
import {
  OryPermissionsModule,
  OryRelationshipsModule,
} from '@getlarge/keto-client-wrapper';
import { OryFrontendModule } from '@getlarge/kratos-client-wrapper';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FosteringController } from './fostering.controller';
import { FosteringService } from './fostering.service';

type AppConfigService = ConfigService<
  {
    ORY_KRATOS_PUBLIC_URL: string;
    ORY_KETO_PUBLIC_URL: string;
    ORY_KETO_ADMIN_URL: string;
    ORY_KETO_API_KEY: string;
  },
  true
>;

@Module({
  imports: [
    TypeOrmModule.forFeature([CatProfileSchema, FosteringSchema, UserSchema]),
    OryFrontendModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService) => ({
        basePath: (configService as AppConfigService).get(
          'ORY_KRATOS_PUBLIC_URL'
        ),
      }),
    }),
    OryPermissionsModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService) => ({
        basePath: (configService as AppConfigService).get(
          'ORY_KETO_PUBLIC_URL'
        ),
      }),
    }),
    OryRelationshipsModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService) => ({
        accessToken: (configService as AppConfigService).get(
          'ORY_KETO_API_KEY'
        ),
        basePath: (configService as AppConfigService).get('ORY_KETO_ADMIN_URL'),
      }),
    }),
  ],
  controllers: [FosteringController],
  providers: [FosteringService],
})
export class FosteringModule {}
