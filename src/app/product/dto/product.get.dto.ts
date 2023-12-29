import { ApiProperty } from "@nestjs/swagger";

export class ProductGetDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    image: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    category_id: number;
    @ApiProperty()
    status: number;
    @ApiProperty()
    create_at: Date;
    @ApiProperty()
    update_at: Date;
}