import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';

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
      return {
        error: 'User not found',
        statusCode: 404,
      };
    }
    return user;
  }

  @Post()
  createUser(@Body() newUser: User) {
    this.users.push(newUser);
    return newUser;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return {
        error: 'User not found',
        statusCode: 404,
      };
    }
    const deletedUser = this.users.splice(index, 1);
    return deletedUser[0];
  }
}
