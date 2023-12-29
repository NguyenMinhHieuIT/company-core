import { ApiProperty } from "@nestjs/swagger";

export class GetUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  image: string;
  @ApiProperty()
  status : string;
  @ApiProperty()
  created_at: string;
  @ApiProperty()
  updated_at: string;
}