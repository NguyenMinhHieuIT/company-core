import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, Query, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CommonController } from '../common';
import { SettingEntity } from './entities/setting.entity';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetSettingDto } from './dto/setting.get.dto';
import { DeepPartial } from 'typeorm';
import { GetListSettingDto } from './dto/setting.get.list.dto';
@ApiTags('settings')
@Controller()
export class SettingController extends CommonController<SettingEntity> {
  constructor(protected readonly settingService: SettingService) {
    super(settingService);
  }

  @Get('admin/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({name:'page' , description:'Trang số' , required:false , type:Number})
  @ApiQuery({name:'limit' , description:'Giới hạn' , required:false , type:Number})
  @ApiResponse({ status: 200, description: 'Get list of data successfully.' , type: GetSettingDto})
  public index(@Request() req, @Query() query): Promise<void> {
    return this.service.findAll(req.user, query, true);
  }

  //Get ALL FOR USER
  @Get('settings')
  @ApiBearerAuth()
  @ApiQuery({name:'page' , description:'Trang số' , required:false , type:Number})
  @ApiQuery({name:'limit' , description:'Giới hạn' , required:false , type:Number})
  @ApiResponse({ status: 200, description: 'Get list of data successfully.' , type:  GetSettingDto})
  public indexForUser(@Request() req, @Query() query): Promise<void> {
    return this.settingService.findAllForUser(req.user, query, true);
  }

  @Get('admin/settings/get-list')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Get list of data successfully.' , type:  GetListSettingDto})
  public getList(){
    return this.settingService.getList();
  }

  @Get('admin/setting/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({name:'id' , description:'id' , required:true , type:Number})
  @ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
    type: GetSettingDto
  })
  public async view(@Request() req, @Param('id') id: number, @Query() params) {
    return this.service.findOneById(req.user, id, params);
  }

  @Post('admin/setting')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async create(
    @Request() req,
    @Body() data: CreateSettingDto,
  ): Promise<void> {
    // req.user
    return this.service.create(req.user, data);
  }

  @Put('admin/setting/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async update(
    @Request() req,
    @Param('id') id: number,
    @Body() data: UpdateSettingDto,
  ): Promise<any> {
    return this.service.update(req.user, id, data);
  }

  @Delete('admin/setting/:id')
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
