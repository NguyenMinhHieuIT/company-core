import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { } from '@nestjs/platform-express';

export class PathImgDto {
  @ApiProperty()
  path: string;
}