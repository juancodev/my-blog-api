import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EnvConfig } from './env.model';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvConfig>) => ({
        type: 'postgres',
        host: configService.get('HOST'),
        port: Number(configService.get('DB_PORT') ?? 5432),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // hace que se despliegue los datos de manera automática, no es recomendado para producción.
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PostModule,
    AuthModule,
    AiModule,
  ],
})
export class AppModule {}

/*
* ConfigModule permite cargar y gestionar variables de entorno de manera sencilla. Al establecer isGlobal: true, hacemos que el módulo de configuración esté disponible en toda la aplicación sin necesidad de importarlo en cada módulo.
* ConfigModule permite leer las variables de entorno.

*/
