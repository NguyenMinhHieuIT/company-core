import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "Nội dung comment không được để trống"
  })
  content: string;

  @ApiProperty()
  parent_id: number;

  @ApiProperty()
  @IsNotEmpty({
    message: "Chưa có khóa ngoại của user"
  })
  user_id: number;

  @ApiProperty()
  @IsNotEmpty({
    message: "Chưa có khóa ngoại của bài viết"
  })
  post_id: number;
}