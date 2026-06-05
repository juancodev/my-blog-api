import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './../services/auth.service';

@Injectable()
// (1)
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // (2)
      passwordField: 'password', // (3)
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    return user;
  }
}

/*
  (1).- La clase LocalStrategy extiende PassportStrategy, lo que permite integrar la estrategia de autenticación local de Passport.js en la aplicación NestJS. Esto facilita la implementación de la autenticación basada en nombre de usuario y contraseña.
  (2).- Configura el campo de nombre de usuario para que sea 'email' en lugar del valor predeterminado 'username'. Esto significa que cuando un usuario intente autenticarse, deberá proporcionar su correo electrónico en lugar de un nombre de usuario.
  (3).- Configura el campo de contraseña para que sea 'password' (esto es opcional, ya que es el valor predeterminado).
 */
