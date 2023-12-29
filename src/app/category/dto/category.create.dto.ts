import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CategoryCreateDto {
    @IsNotEmpty({message:'tên không để trống!'})
    @IsString({message:'Tên phải là chuỗi'})
    @ApiProperty()
    name: string;

    @IsNotEmpty({message:'kiểu không để trống!'})
    @IsString({message:'kiểu phải là chuỗi'})
    @ApiProperty()
    type: string;

    
    @ApiProperty()
    @IsNotEmpty({message:'Mô tả không để trống!'})
    @IsString({message:'Mô tả phải là chuỗi'})
    description: string;

   
    @ApiProperty()
    @IsIn([0,1] , {message:'Is_show_menu chỉ nhận 0 và 1'})
    is_show_menu: number;

    @ApiProperty()
    @IsNotEmpty({message:'url ảnh không để trống'})
    @IsString({message:'url ảnh phải là chuỗi'})
    image:string;

    @ApiProperty()
    @IsOptional()
    @IsInt({message:'parent_id phải là một số!'})
    parentId?: number;
}