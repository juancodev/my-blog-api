import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const newPost = this.postRepository.create({
        ...createPostDto,
        user: { id: createPostDto.userId },
      });
      return await this.postRepository.save(newPost);
    } catch {
      throw new BadRequestException('Wrong to the create post');
    }
  }

  async findAll() {
    return this.postRepository.find({
      relations: { user: { profile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.findPostById(id);
  }

  async findPostsByUser(userId: number) {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: { user: { profile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findPostById(id);
      const updatedPost = this.postRepository.merge(post, updatePostDto);
      return await this.postRepository.save(updatedPost);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Wrong to the update post');
    }
  }

  async remove(id: number) {
    await this.postRepository.delete(id);
    return { message: `Post with id ${id} has been deleted` };
  }

  private async findPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { user: { profile: true } },
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }
}
