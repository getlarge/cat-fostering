// trick static analyzers
import 'pg';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { AppModule } from './app/app.module';
import { EnvironmentVariables } from './app/environment-variables';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      bufferLogs: true,
      snapshot: true,
    }
  );
  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  app.disable('x-powered-by');
  const localEnv = ['local', 'development', 'test', 'ci'];
  if (localEnv.includes(configService.get('NODE_ENV'))) {
    app.enableCors({
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cookie',
      ],
      credentials: true,
      origin: true,
    });
  }

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Generate OpenAPI spec
  const docBuilder = new DocumentBuilder()
    .setTitle('Cat Fostering API')
    .setDescription('Cat Fostering OpenAPI specifications')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-ory-api-key',
        in: 'header',
      },
      'ory-action'
    )
    .addBearerAuth()
    .addCookieAuth(configService.get('ORY_SESSION_COOKIE_NAME'))
    .addTag('users')
    .addTag('cat-profiles')
    .addTag('fostering')
    .build();

  const document = SwaggerModule.createDocument(app, docBuilder);

  const openapiPath = resolve(
    join('apps', 'cat-fostering-api', 'openapi.json')
  );
  if (existsSync(openapiPath)) {
    await writeFile(openapiPath, JSON.stringify(document, null, 2), 'utf-8');
  }

  // Swagger UI
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('open-api', app, document, customOptions);

  const port = configService.get('PORT', { infer: true });
  const host = configService.get('HOST', { infer: true });
  await app.listen(port, host);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
