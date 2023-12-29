import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/user.entity';
import { CategoryEntity } from '../category/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PostEntity , UserEntity , CategoryEntity])],
  controllers: [PostController],
  providers: [PostService],
  exports:[PostService]
})
export class PostModule {}
