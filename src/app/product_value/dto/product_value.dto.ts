import { ApiProperty } from "@nestjs/swagger";

export class ProductValueDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
}