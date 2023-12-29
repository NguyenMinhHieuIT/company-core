import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSettingDto {
    @IsNotEmpty({message:'Tên không được để trống!'})
    @IsString({message:'Tên phải là chuỗi!'})
    @ApiProperty()
    name:string;

    @IsString({message:'Giá trị phải là chuỗi!'})
    @IsNotEmpty({message:'Giá trị không được để trống!'})
    @ApiProperty()
    value:string;

    @ApiProperty()
    @IsOptional()
    @IsString({message:'Mô tả là chuỗi !'})
    description?:string;
}
