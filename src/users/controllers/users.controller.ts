import { Controller, Get, Param, Post, Body, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

// (1)
@Controller('users')
export class UsersController {
  // (2)

  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: User })
  @Get()
  getAllUsers() {
    return this.usersService.findAllUsers();
  }

  // (3)
  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserById(id);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @Get(':id/profile')
  getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserWithProfile(id);
  }

  @ApiOperation({ summary: 'Get user posts' })
  @Get(':id/posts')
  getUserPosts(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserPosts(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @ApiOperation({ summary: 'Delete user' })
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
