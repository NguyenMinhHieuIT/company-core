import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CategoryCreateDto } from "./category.create.dto";


export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {
   
}