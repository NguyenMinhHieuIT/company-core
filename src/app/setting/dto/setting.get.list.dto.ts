import { ApiProperty } from "@nestjs/swagger";

export class GetListSettingDto{
    @ApiProperty()
    id:number;
    @ApiProperty()
    name:string;
}