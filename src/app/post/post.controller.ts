import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, Put, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommonController } from '../common';
import { PostEntity } from './entities/post.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPostDto } from './dto/post.get.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { GetListPostDto } from './dto/post.get.list.dto';
import { configStogare } from 'src/utils/config';
import { UploadImageDto } from './dto/upload.image.dto';

@ApiTags("Posts")
@Controller()
export class PostController extends CommonController<PostEntity> {
  constructor(protected readonly postService: PostService) {
    super(postService)
  }

  @Get('admin/posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Giới hạn', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Get list of data successfully.', type: GetPostDto })
  public index(@Request() req, @Query() query): Promise<void> {
    return this.service.findAll(req.user, query, true);
  }

  //Get all for user
  @Get('/posts')
  @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Giới hạn', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Get list of data successfully.', type: GetPostDto })
  public indexForUser(@Query() query): Promise<void> {
    return this.postService.findAllForUser(query, true);
  }

  //Get list
  @Get('admin/posts/get-list')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Get list of data successfully.', type: GetListPostDto })
  public getList(){
    return this.postService.getList();
  }

  @Get('admin/post/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
    type: GetPostDto
  })
  public async view(@Request() req, @Param('id') id: number, @Query() params) {
    return this.service.findOneById(req.user, id, params);
  }

  @Post('admin/post')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async createPost(
    @Request() req,
    @Body() data: CreatePostDto
  ): Promise<void> {
    return this.postService.create(req.user, data );
  }

  @Put('admin/post/:id')
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
    @Body() data: UpdatePostDto,
  ): Promise<any> {
    return this.service.update(req.user, id, data);
  }

  @Delete('admin/post/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  public async delete(@Request() req, @Param('id') id: number): Promise<any> {
    return this.service.delete(req.user, id);
  }


  
  @Post('admin/upload-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image' , configStogare))
  @ApiBody({
    description: 'Image file',
    type: UploadImageDto,
    
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200
  })
  public uploadImage(@UploadedFile() file:Express.Multer.File){
    if(file){
       return {
        success: true,
        path: file.destination + '/' + file.filename
      }
    }else{
      return {
        success:false,
        message:"Lỗi upload file!"
      }
    }
     
  }


  //GET ONE FOR USER
@Get('post/:id')
@ApiBearerAuth()
@ApiParam({name:'id' , description:'id post' , required:true , type:Number})
@ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
    type:GetPostDto
})
public async viewForUser(@Param('id') id: number, @Query() params) {
    return this.postService.findOneByIdForUser(id, params);
}

}
