import { Controller, Get, Param, Post, Body, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';

// Decorators son aquellos que nos permite controlar el acceso desde el endpoint, es decir, desde la ruta /users
@Controller('users')
export class UsersController {
  // inyectamos el servicio de usuarios para poder acceder a los métodos que tenemos en el servicio, como findAllUsers, findUserById, create, updateUser y deleteUser

  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAllUsers();
  }

  // ParseIntPipe es un pipe de validación que se encarga de trasnformar el parámetro id de string a number.

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserById(id);
  }

  @Get(':id/profile')
  getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserWithProfile(id);
  }

  @Get(':id/posts')
  getUserPosts(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserPosts(id);
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
