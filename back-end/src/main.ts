import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './common/utils/loggers';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  app.enableCors({
    origin: true,
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization, ngrok-skip-browser-warning',
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);

  winstonLogger.info({
    level: 'info',
    message: '🧪 Log estructurado de prueba',
    service: 'Debug',
    operation: 'manualTest',
    details: {
      example: true,
      number: 42,
    },
    timestamp: new Date().toISOString(),
  });


  winstonLogger.info('✅ App NestJS iniciada y conectada a Elastic correctamente');
  winstonLogger.info(`🚀 App running on port ${process.env.PORT || 3000}`);
}
bootstrap();
