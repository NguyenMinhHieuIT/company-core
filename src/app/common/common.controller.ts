import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { CommonService } from './common.service';
import { AccessInterceptor } from './interceptor/access.interceptor';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BaseEntity } from './base.entity';

@UseInterceptors(AccessInterceptor)
export class CommonController<T extends BaseEntity> {
  protected service: CommonService<T>;

  constructor(crudService: CommonService<T>) {
    this.service = crudService;
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
  public index(@Request() req, @Query() query): Promise<void> {
    return this.service.findAll(req.user, query, true);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
  })
  public async view(@Request() req, @Param('id') id: number, @Query() params) {
    return this.service.findOneById(req.user, id, params);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async create(
    @Request() req,
    @Body() data: DeepPartial<T>,
  ): Promise<void> {
    // req.user
    return this.service.create(req.user, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
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
    @Body() data: DeepPartial<T>,
  ): Promise<any> {
    return this.service.update(req.user, id, data);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  public async delete(@Request() req, @Param('id') id: number): Promise<any> {
    return this.service.delete(req.user, id);
  }

  public formatDate(datetime) {
    if (datetime != '0000-00-00 00:00:00') {
      // return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
    }
    return datetime;
  }

  base64Encode(data) {
    return Buffer.from(data).toString('base64');
  }

  base64Decode(data) {
    return Buffer.from(data, 'base64').toString('ascii');
  }

}
