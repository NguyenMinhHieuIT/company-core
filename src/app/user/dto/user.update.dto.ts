
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsPhoneNumber, IsNumber, Min, Max, IsIn, MinLength } from 'class-validator';

class Update {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail(
    { allow_display_name: true },
    {
      message: 'Email không đúng định dạng, vui lòng thử lại',
    },
  )
  @ApiProperty()
  email?: string;

  @IsString({ message: 'Họ tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @ApiProperty()
  @MinLength(3, {message : "Họ tên tối thiểu phải là 3 kí tự"})
  fullName?: string;

  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @ApiProperty()
  address?: string;

  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @MinLength(10, {message : "Số điện thoại tối thiểu phải 10 số"})
  @ApiProperty()
  phone?: string;

  @IsString({ message: 'Giới tính phải là chuỗi' })
  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  @IsIn(['male', 'female'], { message: 'Giới tính phải là "male" hoặc "female"' })
  @IsOptional()
  @ApiProperty()
  gender?: string;

  @IsNumber({}, { message: 'Tuổi phải là số' })
  @IsNotEmpty({ message: 'Tuổi không được không được để trống' })
  @Min(18, { message: 'Tuổi phải lớn hơn hoặc bằng 18' })
  @Max(100, { message: 'Tuổi phải nhỏ hơn hoặc bằng 100' })
  @IsOptional()
  @ApiProperty()
  age?: number;
}

export class UpdateUserDto extends PartialType(Update) { }
