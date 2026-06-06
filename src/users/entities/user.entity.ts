import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Profile } from './profile.entity';
import { Post } from '../../post/entities/post.entity';

// (1)
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The id of the user' })
  id!: number;

  @ApiProperty({ description: 'The email of the user' })
  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @ApiProperty({ description: 'The password of the user' })
  @Column({ type: 'varchar', length: 50 }) // (2)
  @Exclude() // (3)
  password!: string;

  @ApiProperty({ description: 'The creation date of the user' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'The update date of the user' })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt!: Date;

  @OneToOne(() => Profile, { nullable: false, cascade: true })
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  // (4)
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

/**
  (1).- Nombre en que se crea la tabla en nuestra base de datos.
  (2).- select: false excluye la propiedad password al hacer una consulta a la base de datos, es decir, al obtener un usuario, no se incluirá la contraseña.
  (3).- Excluye la propiedad password al serializar la entidad, es decir, al devolver un usuario en una respuesta HTTP, no se incluirá la contraseña.
  (4).- Antes de insertar un nuevo usuario, se encripta la contraseña utilizando bcrypt.
 */
