import { ApiProperty } from "@nestjs/swagger";

export class GetSettingDto {
    @ApiProperty()
    id:number;
    @ApiProperty()
    name:string;
    @ApiProperty()
    value:string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    status:number;
    @ApiProperty()
    create_at:Date;
    @ApiProperty()
    update_at:Date;
}