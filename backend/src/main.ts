import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger/dist';
import passport from 'passport';
import { CustomWsAdapter } from './middleware/custom-ws-adapter';
import { sessionMiddleware } from './middleware/session.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET, POST, PATCH, DELETE, OPTIONS',
    credentials: true,
  });
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new CustomWsAdapter(sessionMiddleware, app));
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

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
