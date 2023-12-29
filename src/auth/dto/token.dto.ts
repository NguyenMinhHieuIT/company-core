import { IsNumber, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  id: string;

  @IsNumber()
  expiresIn: number;

  @IsString()
  audience: string;

  @IsString()
  issuer: string;
}