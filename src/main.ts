import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar la validación global para todas las rutas
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
