import { IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductAttributeDto } from 'src/app/product_attribute/dto/product_attribute.dto';
import { ProductValueDto } from 'src/app/product_value/dto/product_value.dto';

export class ProductAttributeValueDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty({
    type: ProductAttributeDto,
    description: "Array of product attributes",
  })
  attribute: []

  @ApiProperty({
    type: ProductValueDto,
    description: "Array of product values",
  })
  value: []

}
