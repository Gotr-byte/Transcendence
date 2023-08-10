import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/HttpException.filter';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: 'shiorghdogihsofiejozkjukutz56tj3445g4u6',
      saveUninitialized: false,
      resave: false,
      cookie: { maxAge: 1000 * 60 * 24 * 3 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
