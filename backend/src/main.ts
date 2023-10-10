import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/HttpException.filter';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger/dist';
import passport from 'passport';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET, POST, PATCH, DELETE',
    credentials: true,
  });
  app.use(
    session({
      secret: process.env.SESSIONS_SECRET + '1896',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 4320000,
        httpOnly: true,
        sameSite: 'strict',
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Transcendence API Testing Ground')
    .setDescription('API description + testing ground for Transcendence')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
