import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/HttpException.filter';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as passport from 'passport';
import * as session from 'express-session';
import { PrismaClient } from '@prisma/client';

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
      cookie: { maxAge: 4320000 },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
