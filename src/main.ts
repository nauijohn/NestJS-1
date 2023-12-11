import { json, urlencoded } from 'express';
import * as basicAuth from 'express-basic-auth';
import * as session from 'express-session';
import * as passport from 'passport';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import {
  SESSION_COOKIE_MAX_AGE,
  SESSION_SECRET,
} from './config/config.constant';
import { AxiosErrorExceptionFilter } from './filters/axios-error-exception.filter';
import { MongoExceptionFiler } from './filters/mongo-exception.filter';
import { TypeOrmFilter } from './filters/typeorm-error.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const configService = new ConfigService();

  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: configService.get(SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: parseInt(configService.get(SESSION_COOKIE_MAX_AGE)) },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new MongoExceptionFiler(httpAdapter),
    new AxiosErrorExceptionFilter(httpAdapter),
    new TypeOrmFilter(httpAdapter),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({ origin: '*', allowedHeaders: '*', methods: '*' });

  app.use(
    // Paths you want to protect with basic auth
    '/api/swagger',
    basicAuth({
      challenge: true,
      users: {
        galago: 'gogogalago',
      },
    }),
  );

  const port = process.env.PORT || 3000;
  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('https://api.galago.com.ph/')
    .addServer(`http://localhost:${port}`)
    .setTitle('Galago Api App')
    .setDescription('API endpoints for the Galago APP')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(port);
  logger.verbose(`Application listening on port ${port}`);
}
bootstrap();
