import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar la validación global para todas las rutas, es decir, los validator en los DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina las propiedades que no están definidas en el DTO.
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades que no están definidas en el DTO.
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos, por ejemplo, convertir una cadena a un número si el DTO lo requiere.
      },
    }),
  ); // Como estamos utilizando transform debemos activarlo.

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Habilitar el interceptor global para serializar las respuestas, es decir, aplicar los decoradores @Exclude y @Expose en las entidades.
  await app.listen(process.env.APP_PORT ?? 3500);
}
bootstrap();
