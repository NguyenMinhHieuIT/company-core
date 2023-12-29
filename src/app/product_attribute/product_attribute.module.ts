import { Module } from '@nestjs/common';
import { ProductAttributeService } from './product_attribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeEntity } from './product_attribute.entity';
import { ProductAttributeController } from './product_attribute.controller';


@Module({
  imports: [TypeOrmModule.forFeature([ProductAttributeEntity])],
  controllers: [ProductAttributeController],
  providers: [ProductAttributeService],
  exports: [ProductAttributeService],
})
export class ProductAttributeModule { }
