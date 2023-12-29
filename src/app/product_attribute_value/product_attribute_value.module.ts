import { Module, forwardRef } from '@nestjs/common';
import { ProductAttributeValueController } from './product_attribute_value.controller';
import { ProductAttributeValueService } from './product_attribute_value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeValueEntity } from './product_attribute_value.entity';
import { ProductModule } from '../product/product.module';
import { ProductAttributeModule } from '../product_attribute/product_attribute.module';
import { ProductValueModule } from '../product_value/product_value.module';
import { ProductService } from '../product/product.service';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttributeValueEntity, ProductEntity]), forwardRef(() => ProductModule), ProductAttributeModule, ProductValueModule],
  controllers: [ProductAttributeValueController],
  providers: [ProductAttributeValueService],
  exports: [ProductAttributeValueService]
})
export class ProductAttributeValueModule { }