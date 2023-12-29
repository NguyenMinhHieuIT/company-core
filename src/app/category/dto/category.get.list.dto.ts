import { ApiProperty } from "@nestjs/swagger";

export class GetListCategoryDto{
    @ApiProperty()
    id:number
    @ApiProperty()
    name:string
}