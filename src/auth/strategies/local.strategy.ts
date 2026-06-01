import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './../services/auth.service';

@Injectable()
// La clase LocalStrategy extiende PassportStrategy, lo que permite integrar la estrategia de autenticación local de Passport.js en la aplicación NestJS. Esto facilita la implementación de la autenticación basada en nombre de usuario y contraseña.
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Configura el campo de nombre de usuario para que sea 'email' en lugar del valor predeterminado 'username'.
      passwordField: 'password', // Configura el campo de contraseña para que sea 'password' (esto es opcional, ya que es el valor predeterminado).
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    return user;
  }
}
