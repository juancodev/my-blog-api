import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar la validación global para todas las rutas, es decir, los validator en los DTO.
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // Como estamos utilizando transform debemos activarlo.
  await app.listen(process.env.APP_PORT ?? 3500);
}
bootstrap();
