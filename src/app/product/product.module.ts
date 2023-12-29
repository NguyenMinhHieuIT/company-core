import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { CategoryModule } from '../category/category.module';
import { ProductAttributeModule } from '../product_attribute/product_attribute.module';
import { ProductValueModule } from '../product_value/product_value.module';
import { ProductAttributeValueService } from '../product_attribute_value/product_attribute_value.service';
import { ProductAttributeValueModule } from '../product_attribute_value/product_attribute_value.module';
import { ProductAttributeValueEntity } from '../product_attribute_value/product_attribute_value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductAttributeValueEntity]), CategoryModule, ProductAttributeModule, ProductValueModule, forwardRef(() => ProductAttributeValueModule)],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule { }