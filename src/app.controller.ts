import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello() {
    return this.usersService.findAllUsers();
  }

  @Get('config')
  getConfigHello(): string {
    return this.appService.getHello();
  }
}
