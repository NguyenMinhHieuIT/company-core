import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { PostEntity } from '../post/entities/post.entity';

@Module({
  imports : [TypeOrmModule.forFeature([CommentEntity, UserEntity, PostEntity])],
  providers : [CommentService, UserService],
  controllers : [CommentController]
})
export class CommentModule {}
