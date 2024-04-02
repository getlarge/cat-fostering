import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
