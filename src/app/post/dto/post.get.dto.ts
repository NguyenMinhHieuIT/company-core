import { ApiProperty } from "@nestjs/swagger";

export class GetPostDto{
    @ApiProperty()
	id:number;
    @ApiProperty()
    published_at:Date;
    @ApiProperty()
	title :string;
    @ApiProperty()
	content :string;
    @ApiProperty()
	image :string;
    @ApiProperty()
	description ?: string;
    @ApiProperty()
	user_id : number;
    @ApiProperty()
	category_id :number;
    @ApiProperty()
	status :number;
    @ApiProperty()
	createAt :Date;
    @ApiProperty()
	updateAt :Date;
}