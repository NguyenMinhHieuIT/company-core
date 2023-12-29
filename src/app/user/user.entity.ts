import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsString, IsStrongPassword, Length, Min, MinLength, minLength } from 'class-validator';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Gender } from '../../utils/gender.enum';
import { CommentEntity as Comment } from '../comment/comment.entity';
import { PostEntity } from '../post/entities/post.entity';

@Index('email', ['email'], { unique: true })
@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', length: 255 })
  @ApiProperty()
  @IsNotEmpty({
    message: 'email không được để trống',
  })
  @IsEmail(
    { allow_display_name: true },
    {
      message: 'Email không đúng định dạng, vui lòng thử lại',
    },
  )
  email: string;

  @Column('varchar', { name: 'password', length: 255 })
  @ApiProperty()
  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  password: string;

  @Column('varchar', { name: 'full_name', nullable: true, length: 100 })
  @IsNotEmpty({
    message: 'Tên không được để trống',
  })
  fullName: string | null;

  @Column("varchar", { name: 'address', nullable: true, length: 100 })
  address: string | null;

  @Column("varchar", { name: 'phone', length: 15 })
  @IsNumberString()
  @MinLength(10)
  phone: string | null;

  @Column({ type: "enum", name: "gender", enum: Gender })
  gender: string

  @Column("int", { name: 'age' })
  @IsNotEmpty({
    message: "Tuổi không được để trống"
  })
  @Min(18)
  age: number

  @Column('varchar', { name: 'image', length: 100 })
  image: string

  @Column('datetime', { name: 'last_access', nullable: true })
  lastAccess: Date | null;

  @OneToMany(() => Comment, comment => comment.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  comments: Comment[];

  @OneToMany(() => PostEntity, post => post.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  posts: PostEntity[];
}
