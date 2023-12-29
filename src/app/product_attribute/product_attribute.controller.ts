import { Controller, Get, Post, Put, Delete, Body, Request, Query, UsePipes, ValidationPipe, Param, UseGuards } from '@nestjs/common';
import { ProductAttributeEntity } from './product_attribute.entity';
import { ProductAttributeService } from './product_attribute.service';
import { CommonController } from '../common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductAttributeCreateDto } from './dto/product_attribute.create.dto';
import { ProductAttributeUpdateDto } from './dto/product_attribute.update.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ProductAttributeGetDto } from './dto/product_attribute.get.dto';

@ApiTags('product_attributes')
@Controller('')
export class ProductAttributeController extends CommonController<ProductAttributeEntity> {
    constructor(protected readonly service: ProductAttributeService) {
        super(service);
    }

    @Get('admin/product_attributes')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
    @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
    @ApiResponse({ status: 200, description: 'Get list of data successfully.', type: ProductAttributeGetDto })
    public index(@Request() req, @Query() query): Promise<void> {
        return this.service.findAll(req.user, query, true);
    }


    @Get('admin/product_attributes/getlist')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
    @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
    @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
    public async getListData(): Promise<void> {
        return this.service.getListData()
    }

    @Get('product_attributes')
    @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
    public async getDataToShow(): Promise<void> {
        return this.service.getDataToShow()
    }

    @Get('admin/product_attributes/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'id product_attribute', required: true, type: Number })
    @ApiResponse({
        status: 200,
        description: 'Get by the ID of data successfully.',
        type: ProductAttributeGetDto
    })
    public async view(@Request() req, @Param('id') id: number, @Query() params) {
        return this.service.findOneById(req.user, id, params);
    }

    @Post('admin/product_attributes')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    public async create(
        @Request() req,
        @Body() data: ProductAttributeCreateDto,
    ): Promise<void> {
        // req.user
        return this.service.create(req.user, data);
    }


    @Put('admin/product_attributes/:id')
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
        @Body() data: ProductAttributeUpdateDto,
    ): Promise<any> {
        return this.service.update(req.user, id, data);
    }

    @Delete('admin/product_attributes/:id')
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
