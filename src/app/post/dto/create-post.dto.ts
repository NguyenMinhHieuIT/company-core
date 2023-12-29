import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    
    @ApiProperty()
    @IsString({message:'title phải là chuỗi'})
    @IsNotEmpty({message:'title không để trống'})
	title :string;

    @ApiProperty()
    @IsNotEmpty({message:'Content không để trống'})
    @IsString({message:'Content phải là chuỗi'})
	content :string;

    @IsNotEmpty({message:'url image không để trống'})
    @IsString({message:'url ảnh phải là chuỗi'})
    @ApiProperty()
    image:string;

    @ApiProperty()
    @IsOptional()
    @IsString({message:'Mô tả là một chuỗi'})
	description ?: string;

    @ApiProperty()
    @IsNotEmpty({message:'user_id không để trống'})
    @IsInt({message:'user id phải là một số'})
	user_id : number;

    @ApiProperty()
    @IsNotEmpty({message:'category_id không để trống'})
    @IsInt({message:'category_id phải là một số'})
	category_id :number;
}
