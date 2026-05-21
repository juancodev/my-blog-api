import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User } from './entities/user.entity';

// El decorador @Injectable() marca esta clase como un proveedor que puede ser inyectado en otros componentes de NestJS, como controladores o servicios. Esto permite que NestJS gestione la creación y el ciclo de vida de esta clase, facilitando la inyección de dependencias y promoviendo una arquitectura modular y escalable.

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async findAllUsers() {
    const users = await this.usersRepository.find({ relations: { profile: true } });
    return users;
  }

  async findUserById(id: number) {
    const user = await this.findOne(id);
    if (user.id === 1) {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
  }

  async findUserWithProfile(id: number) {
    const user = await this.findOne(id);
    const userProfile = await this.usersRepository.find({ where: { id: user.id }, relations: { profile: true } });
    if (user.id === 1) {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return userProfile;
  }

  async create(newUser: CreateUserDto) {
    try {
      const user = await this.usersRepository.save(newUser);
      return user;
    } catch {
      throw new BadRequestException('Wrong to the create user');
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = this.usersRepository.merge(user, body);
    return await this.usersRepository.save(updatedUser);
  }

  async deleteUser(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.delete(user.id);
    return { message: `User with id ${id} has been deleted` };
  }

  // Los métodos privados siempre van al final
  private async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
