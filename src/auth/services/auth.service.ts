import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    // Aquí puedes agregar la lógica para validar la contraseña
    // Por ejemplo, usando bcrypt.compare(password, user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
