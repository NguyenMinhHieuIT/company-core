import { Controller, Post, Request, Body, Query, Get, Put, UsePipes, ValidationPipe, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductValueService } from './product_value.service';
import { ProductValueEntity } from './product_value.entity';
import { CommonController } from '../common';
import { ProductValueCreateDto } from './dto/product_value.create.dto';
import { ProductValueUpdateDto } from './dto/product_value.update.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ProductValueGetDto } from './dto/product_value.get.dto';
import { ProductCreateDto } from '../product/dto/product.create.dto';

@ApiTags('product_values')
@ApiBearerAuth()
@Controller('')
export class ProductValueController extends CommonController<ProductValueEntity> {
    constructor(protected readonly service: ProductValueService) {
        super(service);
    }

    @Get('admin/product_values')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
    @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
    @ApiResponse({ status: 200, description: 'Get list of data successfully.', type: ProductValueGetDto })
    public index(@Request() req, @Query() query): Promise<void> {
        return this.service.findAll(req.user, query, true);
    }

    @Get('admin/product_values/getlist')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
    @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
    @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
    public async getListData(): Promise<void> {
        return this.service.getListData()
    }

    @Get('product_values')
    @ApiResponse({ status: 200, description: 'Get list of data successfully.' })
    public async getDataToShow(): Promise<void> {
        return this.service.getDataToShow()
    }

    @Get('admin/product_values/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'id product_value', required: true, type: Number })
    @ApiResponse({
        status: 200,
        description: 'Get by the ID of data successfully.',
        type: ProductValueGetDto
    })
    public async view(@Request() req, @Param('id') id: number, @Query() params) {
        return this.service.findOneById(req.user, id, params);
    }

    @Post('admin/product_values')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    public async create(
        @Request() req,
        @Body() data: ProductValueCreateDto,
    ): Promise<void> {
        // req.user
        return this.service.create(req.user, data);
    }


    @Put('admin/product_values/:id')
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
        @Body() data: ProductValueUpdateDto,
    ): Promise<any> {
        return this.service.update(req.user, id, data);
    }

    @Delete('admin/product_values/:id')
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
