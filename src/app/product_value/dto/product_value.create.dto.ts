import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Index('name', ['name'], { unique: true })
export class ProductValueCreateDto {
    // @IsUnique()
    @IsNotEmpty({
        message: 'giá trị không được để trống',
    })
    // @MinLength(3, {
    //     message: 'giá trị phải ít nhất 3 kí tự',
    // })
    @ApiProperty()
    name: string;

    // @ApiProperty()
    // phoneNumber: string;
}
