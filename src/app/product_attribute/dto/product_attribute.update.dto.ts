import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeUpdateDto {
    // @IsUnique()
    @IsNotEmpty({
        message: 'attribute không được để trống',
    })
    @MinLength(3, {
        message: 'attribute phải ít nhất 3 kí tự',
    })
    @ApiProperty()
    name: string;

}
