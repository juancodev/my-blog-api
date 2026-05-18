import { Controller, Get, Param, Post, Body, Delete, Put, NotFoundException, UnprocessableEntityException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';

interface User {
  id: string;
  name: string;
  email: string;
}

// Decorators son aquellos que nos permite controlar el acceso desde el endpoint, es decir, desde la ruta /users
@Controller('users')
export class UsersController {
  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    {
      id: '3',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
  ];

  @Get()
  getAllUsers() {
    return this.users;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (user.id === '1') {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    const user = {
      ...newUser,
      id: `${this.users.length + 1}`,
    };
    this.users.push(user);
    return user;
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updateUserData = {
      ...this.users[index],
      ...body,
    };
    this.users[index] = updateUserData;
    return updateUserData;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const deletedUser = this.users.splice(index, 1);
    return deletedUser[0];
  }
}
