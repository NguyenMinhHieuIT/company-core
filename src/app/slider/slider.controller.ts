import {
  Get,
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Query,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { CommonController } from '../common';
import { SliderEntity } from './slider.entity';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/slider.create.dto';
import { UpdateSliderDto } from './dto/slider.update.dto';
import { ApiBearerAuth, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetSliderDto } from './dto/slider.get.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeepPartial } from 'typeorm';
import { PathImgDto } from './dto/pathImg.create.dto';


@ApiTags("sliders")
@Controller('')
export class SliderController extends CommonController<SliderEntity>{
  constructor(
    protected readonly service: SliderService
  ) {
    super(service);
  }

  @Get('/sliders')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get list of data successfully"
  })
  public getAllSliders(): Promise<void> {
    return this.service.getAllSliders();
  }

  @Get('admin/sliders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Get list of data successfully.',
    type: GetSliderDto
  })
  public index(@Request() req, @Query() query): Promise<void> {
    return this.service.findAll(req.user, query, true);
  }

  @Get('admin/sliders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
    type: GetSliderDto
  })
  public async view(@Request() req, @Param('id') id: number, @Query() params) {
    return this.service.findOneById(req.user, id, params);
  }

  @Post("admin/sliders")
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async handleCreate(
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
    @Body() data: CreateSliderDto,
  ): Promise<any> {
    return this.service.handleCreate(req.user, data, image);
  }

  @Post("admin/upload_img")
  @UseInterceptors(FileInterceptor('path'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "The path has been successfully uploaded"
  })
  public async handUploadImg(
    @Request() req,
    @Body() data: PathImgDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<{ success: boolean, path: string }> {
    return this.service.handleUploadImg(req.user, image)
  }

  @Put('admin/sliders/:id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async handleUpdate(
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
    @Param('id') id: number,
    @Body() data: UpdateSliderDto,
  ): Promise<any> {
    return this.service.handleUpdate(req.user, id, data, image);
  }

  @Delete('admin/sliders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  public async delete(@Request() req, @Param('id') id: number): Promise<any> {
    return this.service.delete(req.user, id);
  }
}
