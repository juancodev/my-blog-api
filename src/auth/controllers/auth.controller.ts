import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';

/*
 *Importamos el tipo Request de Express para tipar correctamente el objeto req con TypeScript. Esto nos permitirá acceder a las propiedades de req.user sin errores de tipo.
 */

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local')) // (1)
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User; // (2)
    return {
      user,
      access_token: this.authService.generateToken(user), // (3)
    };
  }
}

/*
  (1).- Usamos el guard de autenticación local para proteger la ruta de login. Esto significa que solo los usuarios que proporcionen credenciales válidas podrán acceder a esta ruta.
  (2).- Aseguramos que req.user es del tipo User para acceder a sus propiedades sin errores de tipo.
  (3).- Generamos un token JWT para el usuario autenticado utilizando el método generateToken del AuthService.
 */
