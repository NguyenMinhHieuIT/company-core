import { ApiProperty } from "@nestjs/swagger";

export class GetSliderDto {
  @ApiProperty()
  id : number;
  @ApiProperty()
  title : string;
  @ApiProperty()
  description : string;
  @ApiProperty()
  image : string;
  @ApiProperty()
  url : string;
  @ApiProperty()
  status : string;
  @ApiProperty()
  created_at : string;
  @ApiProperty()
  updated_at : string;
}