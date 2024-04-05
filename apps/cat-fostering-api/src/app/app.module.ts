import { CatProfilesModule } from '@cat-fostering/nestjs-catprofile-module';
import { FosteringModule } from '@cat-fostering/nestjs-fostering-module';
import { UsersModule } from '@cat-fostering/nestjs-user-module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import path from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvironmentVariables } from './environment-variables';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironmentVariables,
      envFilePath: path.resolve(path.join('apps', 'cat-fostering-api', '.env')),
    }),
    LoggerModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    CatProfilesModule,
    FosteringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
