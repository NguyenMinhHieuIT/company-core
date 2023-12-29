import { ApiProperty } from "@nestjs/swagger";

export class ProductAttributeDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
}