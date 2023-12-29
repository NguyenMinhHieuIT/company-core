import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProductAttributeValueDto } from '../../product_attribute_value/dto/product_attribute_value.dto';

class ProductDto {
  @IsNotEmpty({
    message: 'tên sản phẩm không được để trống',
  })
  @MinLength(3, {
    message: 'tên sản phẩm phải ít nhất 3 kí tự',
  })
  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string | null;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  category_id: number;

  @ApiProperty({
    type: [ProductAttributeValueDto],
    description: "Array of product attributes values",
  })
  productAttributeValues: []

}

export class ProductUpdateDto extends PartialType(ProductDto) { }
