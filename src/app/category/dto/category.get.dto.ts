import { ApiProperty } from "@nestjs/swagger";

export class GetCategoryDto {
    @ApiProperty()
    id:number;
    @ApiProperty()
    name:string;
    @ApiProperty()
    type:string;
    @ApiProperty()
    image:string;
    @ApiProperty()
    is_show_menu:number;
    @ApiProperty()
    parentId:number;
    @ApiProperty()
    description: string;
    @ApiProperty()
    status:number;
    @ApiProperty()
    create_at : Date;
    @ApiProperty()
    update_at : Date;
}