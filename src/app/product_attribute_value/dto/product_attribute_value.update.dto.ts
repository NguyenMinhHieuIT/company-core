import { IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeValueUpdateDto {
    @ApiProperty()
    product_id: number;
    @ApiProperty()
    attribute_id: number;
    @ApiProperty()
    value_id: number;
}
