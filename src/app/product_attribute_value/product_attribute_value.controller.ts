import { Controller, Get, Post, Put, Delete, Body, Query, Request, UsePipes, ValidationPipe, Param, UseGuards } from '@nestjs/common';
import { ProductAttributeValueService } from './product_attribute_value.service';
import { ProductAttributeValueEntity } from './product_attribute_value.entity';
import { CommonController } from '../common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductAttributeValueCreateDto } from './dto/product_attribute_value.create.dto';
import { ProductAttributeValueUpdateDto } from './dto/product_attribute_value.update.dto'
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ProductAttributeValueGetDto } from './dto/product_attribute_value.get.dto';

// @ApiTags('product_attributes_values')
@Controller('')
export class ProductAttributeValueController extends CommonController<ProductAttributeValueEntity> {
    constructor(protected readonly service: ProductAttributeValueService) {
        super(service);
    }

    // @Get('admin/product_attributes_values')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
    // @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
    // @ApiResponse({ status: 200, description: 'Get list of data successfully.', type: ProductAttributeValueGetDto })
    // public index(@Request() req, @Query() query): Promise<void> {
    //     return this.service.findAll(req.user, query, true);
    // }


    // @Get('product_attributes_values')
    // @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
    // public async getDataToShow(): Promise<void> {
    //     return this.service.getDataToshow()
    // }


    // @Get('admin/product_attributes_values/:id')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @ApiParam({ name: 'id', description: 'id product_attribute_value', required: true, type: Number })
    // @ApiResponse({
    //     status: 200,
    //     description: 'Get by the ID of data successfully.',
    //     type: ProductAttributeValueGetDto
    // })
    // public async view(@Request() req, @Param('id') id: number, @Query() params) {
    //     return this.service.findOneById(req.user, id, params);
    // }



    // @Post('admin/product_attributes_values')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @ApiResponse({
    //     status: 200,
    //     description: 'The record has been successfully created.',
    // })
    // @ApiResponse({ status: 403, description: 'Forbidden.' })
    // public async create(
    //     @Request() req,
    //     @Body() data: ProductAttributeValueCreateDto,
    // ): Promise<void> {
    //     // req.user
    //     return this.service.create(req.user, data);
    // }


    // @Put('admin/product_attributes_values/:id')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @UsePipes(new ValidationPipe())
    // @ApiResponse({
    //     status: 200,
    //     description: 'The record has been successfully updated.',
    // })
    // @ApiResponse({ status: 403, description: 'Forbidden.' })
    // public async update(
    //     @Request() req,
    //     @Param('id') id: number,
    //     @Body() data: ProductAttributeValueUpdateDto,
    // ): Promise<any> {
    //     return this.service.update(req.user, id, data);
    // }

    // @Delete('admin/product_attributes_values/:id')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @ApiResponse({
    //     status: 200,
    //     description: 'The record has been successfully deleted.',
    // })
    // public async delete(@Request() req, @Param('id') id: number): Promise<any> {
    //     return this.service.delete(req.user, id);
    // }



}
