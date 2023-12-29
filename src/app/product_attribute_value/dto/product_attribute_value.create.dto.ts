import { IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductAttributeCreateDto } from 'src/app/product_attribute/dto/product_attribute.create.dto';
import { ProductValueCreateDto } from 'src/app/product_value/dto/product_value.create.dto';

export class ProductAttributeValueCreateDto {
    @ApiProperty()
    product_id: number;
    @ApiProperty()
    attribute_id: number;
    @ApiProperty()
    value_id: number;

}
