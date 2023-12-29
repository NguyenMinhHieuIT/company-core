import { Controller, Get, Post, Delete, Put, Query, Request, Body, UsePipes, ValidationPipe, Param, UseGuards } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { CommonController } from '../common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductCreateDto } from './dto/product.create.dto';
import { ProductUpdateDto } from './dto/product.update.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ProductGetDto } from './dto/product.get.dto';
import { ProductAttributeValueCreateDto } from '../product_attribute_value/dto/product_attribute_value.create.dto';
import { ProductAttributeValueUpdateDto } from '../product_attribute_value/dto/product_attribute_value.update.dto';

@ApiTags('products')
@Controller('')
export class ProductController extends CommonController<ProductEntity> {
  constructor(protected readonly service: ProductService) {
    super(service);
  }

  @Get('admin/products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
  @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
  @ApiResponse({ status: 200, description: 'Get list of data successfully.', type: ProductGetDto })
  public index(@Request() req, @Query() query): Promise<void> {
    return this.service.findAll(req.user, query, true);
  }

  @Get('admin/products/getlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
  @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
  @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
  public async getListData(): Promise<void> {
    return this.service.getListData()
  }

  @Get('products')
  @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
  public async getDataToShow(@Query() query): Promise<void> {
    return this.service.getDataToshow(query)
  }

  @Get('products/:id')
  @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
  public async getDataByIdToShow(@Param('id') id: number, @Query() params): Promise<void> {
    return this.service.getDataToShowById(id, params)
  }

  @Get('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'id product', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
    type: ProductGetDto
  })
  public async view(@Request() req, @Param('id') id: number, @Query() params) {
    return this.service.findOneById(req.user, id, params);
  }


  @Post('admin/products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async handleCreate(
    @Request() req,
    @Body() data: ProductCreateDto
  ): Promise<void> {
    // req.user
    return this.service.handleCreate(req.user, data);
  }


  @Put('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async handleUpdate(
    @Request() req,
    @Param('id') id: number,
    @Body() data: ProductUpdateDto,
  ): Promise<any> {
    return this.service.handleUpdate(req.user, id, data);
  }

  @Delete('admin/products/:id')
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
