import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { User } from './users/user.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): User[] {
    return this.usersService.findAllUsers();
  }

  @Get('config')
  getConfigHello(): string {
    return this.appService.getHello();
  }
}
