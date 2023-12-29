import { ApiProperty } from "@nestjs/swagger";

export class GetListPostDto{
    @ApiProperty()
    id:number;
    @ApiProperty()
    name:string;
}