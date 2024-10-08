import { CatProfilesModule } from '@cat-fostering/nestjs-catprofile-module';
import { FosteringModule } from '@cat-fostering/nestjs-fostering-module';
import { UsersModule } from '@cat-fostering/nestjs-user-module';
import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule, ConfigService } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import path from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  EnvironmentVariables,
  validateEnvironmentVariables,
} from './environment-variables';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironmentVariables,
      envFilePath: path.resolve(
        path.join(
          'apps',
          'cat-fostering-api',
          ['local', 'development'].includes(process.env['NODE_ENV'])
            ? '.env'
            : `.env.${process.env['NODE_ENV']}`
        )
      ),
    }),
    ConditionalModule.registerWhen(
      DevtoolsModule.registerAsync({
        inject: [ConfigService],
        useFactory: (
          configService: ConfigService<EnvironmentVariables, true>
        ) => ({
          http: true,
          port: configService.get('DEVTOOLS_PORT', { infer: true }),
        }),
      }),
      (env: NodeJS.ProcessEnv) => env.NODE_ENV === 'development'
    ),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers["x-ory-api-key"]',
        ],
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>
      ) => {
        const database = configService.get('POSTGRES_DB', { infer: true });
        const username = configService.get('POSTGRES_USER', { infer: true });
        const password = configService.get('POSTGRES_PASSWORD', {
          infer: true,
        });
        const url = new URL(configService.get('POSTGRES_URL', { infer: true }));
        url.username = username || url.username;
        url.password = password || url.password;
        url.pathname = database ? `/${database}` : url.pathname;
        return {
          type: 'postgres',
          url: url.toString(),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    CatProfilesModule,
    FosteringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
