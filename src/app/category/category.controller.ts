
import {Controller , Get, HttpCode, Post, UseGuards, UsePipes, ValidationPipe , Request , Body , Put , Param, Query, Delete} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags  , ApiQuery , ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DeepPartial } from 'typeorm';
import { CommonController } from '../common';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dto/category.create.dto';
import { GetCategoryDto } from './dto/category.get.dto';
import { GetListCategoryDto } from './dto/category.get.list.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { GetTreeCategoryDto } from './dto/category.get.tree.dto';
@ApiTags('categories')
@ApiBearerAuth()
@Controller()
export class CategoryController extends CommonController<CategoryEntity> {
    constructor(protected readonly categoryService: CategoryService) {
        super(categoryService);
    }

//POST
    @Post('admin/category')
    @UseGuards(JwtAuthGuard)
    @HttpCode(201)
    @UsePipes(ValidationPipe)
    @ApiResponse({ status: 201, description: 'NO CONTENT' })
    public async createCategory(@Request() req, @Body() data: CategoryCreateDto) {
        return await this.service.create(req.user, data);
    }

  
// GET ALL
    @Get('admin/categories')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
    @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
    @ApiResponse({ status: 200, description: 'Get list of data successfully.'  , type:GetCategoryDto })
    public index(@Request() req, @Query() query): Promise<void> {
        return this.service.findAll(req.user, query, true);
    }

// GET LIST
    @Get('admin/categories/get-list')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Get list of data successfully.'  , type:GetListCategoryDto })
    public getList(){
        return this.categoryService.getList()
    }

//GET BY ID
    @Get('admin/category/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({name:'id' , description:'id category' , required:true , type:Number})
    @ApiResponse({
        status: 200,
        description: 'Get by the ID of data successfully.',
        type:GetCategoryDto
    })
    public async view(@Request() req, @Param('id') id: number, @Query() params) {
        return this.service.findOneById(req.user, id, params);
    }

    //GET TREE
    @Get('admin/category/tree')
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Get tree',
        type:GetTreeCategoryDto
    })
    public async getTree() {
        return this.categoryService.getTree();
    }


//UPDATE 
    @Put('admin/category/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UsePipes(new ValidationPipe())
    @ApiBody({type:CategoryUpdateDto})
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    public async update(
        @Request() req,
        @Param('id') id: number,
        @Body() data: DeepPartial<CategoryEntity>,
    ): Promise<any> {
        return this.service.update(req.user, id, data);
    }

// DELETE
    @Delete('admin/category/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({name:'id' , description:'id' , required:true , type:Number})
    @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    })
    public async delete(@Request() req, @Param('id') id: number): Promise<any> {
    return this.service.delete(req.user, id);
    }

    public formatDate(datetime) {
    if (datetime != '0000-00-00 00:00:00') {
    
    }
    return datetime;
    }


// GET ALL (USER)
    @Get('categories')
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number }) // Mô tả query parameter
    @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number }) // Mô tả query parameter
    @ApiResponse({ status: 200, description: 'Get list of data successfully.'  , type:GetCategoryDto })
    public indexForUser(@Query() query): Promise<void> {
        return this.categoryService.findAllForUser(query, true);
    }

//GET ONE FOR USER
    @Get('category/:id')
    @ApiBearerAuth()
    @ApiParam({name:'id' , description:'id category' , required:true , type:Number})
    @ApiResponse({
        status: 200,
        description: 'Get by the ID of data successfully.',
        type:GetCategoryDto
    })
    public async viewForUser(@Param('id') id: number, @Query() params) {
        return this.categoryService.findOneByIdForUser(id, params);
    }
}

