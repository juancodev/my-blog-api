import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto } from './users.dto';

// El decorador @Injectable() marca esta clase como un proveedor que puede ser inyectado en otros componentes de NestJS, como controladores o servicios. Esto permite que NestJS gestione la creación y el ciclo de vida de esta clase, facilitando la inyección de dependencias y promoviendo una arquitectura modular y escalable.

@Injectable()
export class UsersService {
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

  findAllUsers() {
    return this.users;
  }

  findUserById(id: string) {
    const position = this.findOne(id);
    const user = this.users[position];
    if (user.id === '1') {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
  }

  create(newUser: CreateUserDto) {
    const user = {
      ...newUser,
      id: `${this.users.length + 1}`,
    };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, body: UpdateUserDto) {
    const position = this.findOne(id);
    const updateUserData = {
      ...this.users[position],
      ...body,
    };
    this.users[position] = updateUserData;
    return updateUserData;
  }

  deleteUser(id: string) {
    const position = this.findOne(id);
    const deletedUser = this.users.splice(position, 1);
    return deletedUser[0];
  }

  // Los métodos privados siempre van al final
  private findOne(id: string) {
    const position = this.users.findIndex((user) => user.id === id);
    if (position === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return position;
  }
}
