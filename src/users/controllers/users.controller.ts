import { Controller, Get, Param, Post, Body, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';

// (1)
@Controller('users')
export class UsersController {
  // (2)

  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAllUsers();
  }

  // (3)

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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}

/*
 * (1).- Decorators son aquellos que nos permite controlar el acceso desde el endpoint, es decir, desde la ruta /users.
 * (2).- Inyectamos el servicio de usuarios para poder acceder a los métodos que tenemos en el servicio, como findAllUsers, findUserById, create, updateUser y deleteUser.
 * (3).- ParseIntPipe es un pipe de validación que se encarga de trasnformar el parámetro id de string a number.
 */
