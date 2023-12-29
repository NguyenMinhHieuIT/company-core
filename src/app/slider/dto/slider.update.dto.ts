import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, Length } from 'class-validator';

export class Update {
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
  @IsString({ message: 'Đường dẫn hình ảnh phải là chuỗi' })
  @IsNotEmpty({ message: 'Đường dẫn hình ảnh không được để trống' })
  @Length(3, 255, { message: 'Độ dài của đường dẫn tối thiểu là 3 và tối da là 255' })
  image: string;

  @ApiProperty()
  @IsString({ message: 'URL phải là chuỗi' })
  @IsNotEmpty({ message: 'URL không được để trống' })
  @IsUrl({}, { message: 'URL không hợp lệ' })
  url: string;
}

export class UpdateSliderDto extends PartialType(Update) { }
