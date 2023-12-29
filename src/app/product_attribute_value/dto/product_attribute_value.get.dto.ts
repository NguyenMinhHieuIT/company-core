import { ApiProperty } from "@nestjs/swagger";

export class ProductAttributeValueGetDto {
    @ApiProperty()
    product_id: number;
    @ApiProperty()
    attribute_id: number;
    @ApiProperty()
    value_id: number;
    @ApiProperty()
    status: number;
    @ApiProperty()
    create_at: Date;
    @ApiProperty()
    update_at: Date;
}