import { ApiProperty } from "@nestjs/swagger";

export class GetTreeCategoryDto{
    @ApiProperty()
    id:number;
    @ApiProperty()
    name:string;
    @ApiProperty({
        type:  [GetTreeCategoryDto],
        isArray:true,
        required: false, 
    })
    children?: [GetTreeCategoryDto];
}