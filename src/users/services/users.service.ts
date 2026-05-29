import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { User } from '../entities/user.entity';

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

  async findUserPosts(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { posts: true },
      order: { createdAt: 'DESC' },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user.posts;
  }

  async create(body: CreateUserDto) {
    try {
      const user = this.usersRepository.create(body); // crea la estructura pero no lo guarda en la base de datos.
      const userNew = await this.usersRepository.save(user);
      return userNew;
    } catch {
      throw new BadRequestException('Wrong to the create user');
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const updatedUser = this.usersRepository.merge(user, body);
      return await this.usersRepository.save(updatedUser);
    } catch {
      throw new BadRequestException('Wrong to the update user');
    }
  }

  async deleteUser(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.delete(user.id);
    return { message: `User with id ${id} has been deleted` };
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
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
