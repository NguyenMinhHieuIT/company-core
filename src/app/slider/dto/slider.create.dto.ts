import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, Length } from 'class-validator';

export class CreateSliderDto {
  @ApiProperty()
  @IsString({ message: 'Tiêu đề phải là chuỗi' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @Length(3, 50, { message: 'Độ dài của tiêu đề tối thiểu là 3 và tối da là 50' })
  title: string;

  @ApiProperty()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  @Length(3, 255, { message: 'Độ dài của mô tả tối thiểu là 3 và tối da là 255' })
  description?: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  @IsString({ message: 'URL phải là chuỗi' })
  @IsNotEmpty({ message: 'URL không được để trống' })
  url: string;
}
