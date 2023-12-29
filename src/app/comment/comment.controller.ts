import { Body, Controller, Post, UseGuards, Request, Put, UsePipes, ValidationPipe, Delete, Param, Get, Query } from '@nestjs/common';
import { CommonController } from '../common';
import { CommentEntity as Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/comment.create.dto';
import { UpdateCommentDto } from './dto/comment.update.dto';
import { GetCommentDto } from './dto/comment.get.dto';


@ApiTags("comment")
@Controller('')
export class CommentController extends CommonController<Comment>{
  constructor(
    protected readonly service: CommentService
  ) {
    super(service);
  }

  @Get('/comments')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get list of data successfully"
  })
  @ApiQuery({name : 'order', description : "Sắp xếp comment theo thứ tự tăng hoặc giảm dần", required : false, type : Number})
  public getAllComments(@Request() req, @Query() query): Promise<void> {
    return this.service.getAllComments(req, query);
  }

  @Get('admin/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Get list of data successfully.',
    type: GetCommentDto
  })
  public index(@Request() req, @Query() query): Promise<void> {
    return this.service.findAll(req.user, query, true);
  }

  @Get('admin/comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
    type: GetCommentDto
  })
  public async view(@Request() req, @Param('id') id: number, @Query() params) {
    return this.service.findOneById(req.user, id, params);
  }

  @Post('admin/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async create(
    @Request() req,
    @Body() data: CreateCommentDto,
  ): Promise<void> {
    return this.service.create(req.user, data);
  }

  @Put('admin/comments/:id')
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
    @Body() data: UpdateCommentDto,
  ): Promise<any> {
    return this.service.update(req.user, id, data);
  }

  @Delete('admin/comments/:id')
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
