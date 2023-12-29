import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  @IsEmail(
    { allow_display_name: true },
    {
      message: 'Email không đúng định dạng, vui lòng thử lại',
    },
  )
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  @MinLength(6, {
    message: 'Mật khẩu phải từ 8 kí tự trở lên',
  })
  @ApiProperty()
  readonly password: string;
}