import { ApiProperty } from "@nestjs/swagger";

export class GetCommentDto{
  @ApiProperty()
  id : string;
  @ApiProperty()
  content : string;
  @ApiProperty()
  parent_id : number;
  @ApiProperty()
  post_id : number;
  @ApiProperty()
  user_id : number;
  @ApiProperty()
  status : string;
  @ApiProperty()
  created_at : string;
  @ApiProperty()
  updated_at : string;
}