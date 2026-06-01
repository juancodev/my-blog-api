import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { EnvConfig } from 'src/env.model';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    /*JwtModule.register({ secret: 'my_secret_key', signOptions: { expiresIn: '6d' } })
     */
    // Configuramos el módulo JWT de forma asíncrona para poder inyectar el ConfigService y obtener la clave secreta desde las variables de entorno. Esto mejora la seguridad al no hardcodear la clave secreta en el código fuente.
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '6d' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
