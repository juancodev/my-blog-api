import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvConfig } from '../../env.model';
import { Payload } from '../models/payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<EnvConfig>) {
    const secret = configService.get<string>('JWT_SECRET', { infer: true }); //(1)
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // (2)
      ignoreExpiration: false, // (3)
      secretOrKey: secret, // (4)
    });
  }

  validate(payload: Payload) {
    return payload; // (5)
  }
}

/**
 * (1).- Obtiene la clave secreta para verificar el token JWT desde las variables de entorno utilizando el ConfigService.
 * (2).- Configura la estrategia para extraer el token JWT del encabezado de autorización en formato Bearer.
 * (3).- No ignores la expiración del token, lo que significa que los tokens expirados no serán aceptados.
 * (4).- Utiliza la clave secreta obtenida para verificar la validez del token JWT.
 * (5).- Devuelve un objeto con el ID del usuario extraído del token JWT. Este objeto se adjuntará a req.user en los controladores protegidos por esta estrategia.
 */
