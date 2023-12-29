import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductAttributeValueGetDto } from 'src/app/product_attribute_value/dto/product_attribute_value.get.dto';
import { ProductAttributeValueCreateDto } from 'src/app/product_attribute_value/dto/product_attribute_value.create.dto';
import { ProductAttributeValueDto } from 'src/app/product_attribute_value/dto/product_attribute_value.dto';

export class ProductCreateDto {
    // @IsUnique()
    @IsNotEmpty({
        message: 'tên sản phẩm không được để trống',
    })
    @MinLength(3, {
        message: 'tên sản phẩm phải ít nhất 3 kí tự',
    })
    @ApiProperty()
    name: string;

    // @IsNotEmpty({
    //     message: 'ảnh không được để trống',
    // })
    @ApiProperty()
    image: string | null;

    // @IsNotEmpty({
    //     message: 'mô tả không được để trống',
    // })
    @ApiProperty()
    description: string | null;

    @ApiProperty()
    category_id: number;

    @ApiProperty({
        type: [ProductAttributeValueDto],
        description: "Array of product attributes values",
    })
    attributeValues: []
}
