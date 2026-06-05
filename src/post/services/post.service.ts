import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { GeminiService } from '../../ai/services/gemini.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly geminiService: GeminiService,
  ) {}

  async create(body: CreatePostDto, userId: number) {
    try {
      const newPost = this.postRepository.create({
        ...body,
        user: { id: userId },
        categories: body.categoryIds?.map((id) => ({ id })) || [], // [{id: 1}, {id: 2}, ...]
      });
      return await this.postRepository.save(newPost);
    } catch {
      throw new BadRequestException('Wrong to the create post');
    }
  }

  async findAll() {
    return this.postRepository.find({
      relations: { user: { profile: true }, categories: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.findPostById(id);
  }

  async findPostsByUser(userId: number) {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: { user: { profile: true }, categories: true },
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
      relations: { user: { profile: true }, categories: true },
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async getPostsByCategoryId(categoryId: number) {
    const posts = await this.postRepository.find({
      where: { categories: { id: categoryId } },
      relations: { user: { profile: true } },
      order: { createdAt: 'DESC' },
    });
    return posts;
  }

  async publish(id: number, userId: number) {
    const post = await this.findOne(id);
    if (post.user.id !== userId) {
      throw new BadRequestException('You are not the owner of this post');
    }
    if (!post.content || !post.title || post.categories.length === 0) {
      throw new BadRequestException('Post content, title and at least one category are required');
    }
    const summary = await this.geminiService.generateSummary(post.content);
    /* (1)
    const image = await this.geminiService.generateImage(summary!);
      if (!image) {
      throw new BadRequestException('Not Images');
    }
    */
    const changes = this.postRepository.merge(post, {
      isDraft: false,
      summary,
    });
    const updatedPost = await this.postRepository.save(changes);
    return this.findOne(updatedPost.id);
  }
}

/**
  (1).- En este método se llama al servicio de Gemini para generar un resumen del contenido del post. El resumen se genera utilizando el contenido del post como entrada para el modelo de lenguaje de Gemini. El resultado es un texto que resume el contenido original del post. Este resumen se guarda en la base de datos junto con el post cuando se publica, lo que permite mostrar un resumen conciso del post en la interfaz de usuario sin tener que cargar todo el contenido. Además, se podría utilizar este resumen para mejorar la experiencia del usuario al mostrar una vista previa del post antes de que lo lean por completo.
 */
