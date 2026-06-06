import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // (1)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // (2)
      forbidNonWhitelisted: true, // (3)
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // (4)
      },
    }),
  ); // (5)

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // (6)

  const config = new DocumentBuilder().setTitle('Blog API').setDescription('Blog API description').setVersion('1.0').build(); // (7)
  const documentFactory = () => SwaggerModule.createDocument(app, config); // (8)
  SwaggerModule.setup('docs', app, documentFactory, { jsonDocumentUrl: 'swagger/json' }); // (9)

  app.use(helmet()); // (10)
  app.enableCors({ origin: '*' }); // (11)

  await app.listen(process.env.APP_PORT ?? 3500);
}
bootstrap();

/*
  (1).- Habilitar la validación global para todas las rutas, es decir, los validator en los DTO.
  (2).- Elimina las propiedades que no están definidas en el DTO.
  (3).- Lanza un error si se envían propiedades que no están definidas en el DTO.
  (4).- Permite la conversión implícita de tipos, por ejemplo, convertir una cadena a un número si el DTO lo requiere.
  (5).- Como estamos utilizando transform debemos activarlo.
  (6).- Habilitar el interceptor global para serializar las respuestas, es decir, aplicar los decoradores @Exclude y @Expose en las entidades.
  (7).-  Se crea la configuración que permite mostrar la documentación de nuestros Endpoints.
  (8).- Creamos un documentFactory donde exponemos nuestra configuración y nuestra aplicación.
  (9).- Y nos permite inicar el módulo de nuestra documentanción tomando como referencia las carpetas que hemos creado. El primer parámetro indica la ruta de nuestra documentación. "swagger/json" es la manera de cómo descargarlo y recibirlo.
  (10).- Agregamos una capa de seguridad (casco) para proteger nuestra API de vulnerabilidades comunes.
  (11).- Habilitar el soporte para CORS (Cross-Origin Resource Sharing) para permitir solicitudes desde otros dominios.
 */
