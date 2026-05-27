import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from './profile.entity';
import { Post } from '../../post/entities/post.entity';

// Nombre en que se crea la tabla en nuestra base de datos.
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, select: false }) // select: false excluye la propiedad password al hacer una consulta a la base de datos, es decir, al obtener un usuario, no se incluirá la contraseña.
  password!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt!: Date;

  @OneToOne(() => Profile, { nullable: false, cascade: true })
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  // Antes de insertar un nuevo usuario, se encripta la contraseña utilizando bcrypt.
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
