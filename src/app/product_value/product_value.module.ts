import { Module } from '@nestjs/common';
import { ProductValueController } from './product_value.controller';
import { ProductValueService } from './product_value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductValueEntity } from './product_value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductValueEntity])],
  controllers: [ProductValueController],
  providers: [ProductValueService],
  exports: [ProductValueService],
})
export class ProductValueModule { }
