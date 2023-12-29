import { ApiProperty } from "@nestjs/swagger";

export class ProductAttributeGetDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    status: number;
    @ApiProperty()
    create_at: Date;
    @ApiProperty()
    update_at: Date;
}