import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../common/base.entity";
import { UserEntity as User } from "../user/user.entity";
import { IsNotEmpty } from "class-validator";
import { PostEntity as Post } from "../post/entities/post.entity";


@Entity("comments")
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'content', length: 500 })
  @IsNotEmpty({
    message: "Nội dung comment không được để trống"
  })
  content: string;

  @Column({ type: 'int', default: null })
  parent_id: number;

  @Column({ type: 'int' })
  @IsNotEmpty({
    message: 'Chưa có người dùng comment'
  })
  user_id: number;

  @Column({ type: 'int' })
  @IsNotEmpty({
    message: 'Chưa có bài viết'
  })
  post_id: number;

  @ManyToOne(() => User, user => user.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => CommentEntity, comment => comment.parent)
  replies: CommentEntity[];

  @ManyToOne(() => CommentEntity, comment => comment.replies)
  @JoinColumn({ name: 'parent_id' })
  parent: CommentEntity;
} 
