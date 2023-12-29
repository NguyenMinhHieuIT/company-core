import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './app/user/user.module'
import { ProductValueModule } from './app/product_value/product_value.module';
import { ProductAttributeModule } from './app/product_attribute/product_attribute.module';
// import { CategoryModule } from './app/category/category.module';
// import { ProductModule } from './app/product/product.module';
import { CommentModule } from './app/comment/comment.module';
import { SliderModule } from './app/slider/slider.module';
import { SettingModule } from './app/setting/setting.module';
import { CategoryModule } from './app/category/category.module';
import { ProductModule } from './app/product/product.module';
import { ProductAttributeValueModule } from './app/product_attribute_value/product_attribute_value.module';
import { PostModule } from './app/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.development.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    AuthModule,
    UserModule,
    ProductModule,
    ProductValueModule,
    ProductAttributeModule,
    ProductAttributeValueModule,
    UserModule,
    ProductValueModule,
    ProductAttributeModule,
    CommentModule,
    SliderModule,
    SettingModule,
    CategoryModule,
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
