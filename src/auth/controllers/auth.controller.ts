import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

/*
 *Importamos el tipo Request de Express para tipar correctamente el objeto req con TypeScript. Esto nos permitirá acceder a las propiedades de req.user sin errores de tipo.
 */

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local')) // Usamos el guard de autenticación local para proteger la ruta de login. Esto significa que solo los usuarios que proporcionen credenciales válidas podrán acceder a esta ruta.
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }
}
