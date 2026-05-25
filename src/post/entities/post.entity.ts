import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from './category.entity';
@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image' })
  coverImage?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'summary' })
  summary?: string;

  @Column({ type: 'boolean', default: true, name: 'is_draft' })
  isDraft!: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // Many-to-many relaciones entre muchos a muchos y su forma como se aplica.
  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'posts_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories!: Category[];
}
