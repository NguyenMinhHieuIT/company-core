import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Delete,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { CommonController } from '../common';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserEntity as User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.create.dto';
import { GetUserDto } from './dto/user.get.dto';

@ApiBearerAuth()
@ApiTags("user")
@Controller('')
export class UserController extends CommonController<User> {
  constructor(protected readonly service: UserService) {
    super(service);
  }
  @Get('admin/list_users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get list of data successfully"
  })
  public getListUser(@Request() req, @Query() query): Promise<any> {
    return this.service.getListUser();
  }

  @Get('admin/users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Trang số', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Giới hạn số lượng bản ghi', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Get list of data successfully.',
    type: GetUserDto
  })
  public index(@Request() req, @Query() query): Promise<void> {
    return this.service.findAll(req.user, query, true);
  }

  @Get('admin/users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get by the ID of data successfully.',
    type: GetUserDto
  })
  public async view(@Request() req, @Param('id') id: number, @Query() params) {
    return this.service.findOneById(req.user, id, params);
  }

  @Post('admin/users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async create(
    @Request() req,
    @Body() data: CreateUserDto,
  ): Promise<void> {
    return this.service.create(req.user, data);
  }

  @Put('admin/users/:id')
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
    @Body() data: UpdateUserDto,
  ): Promise<any> {
    return this.service.update(req.user, id, data);
  }

  @Delete('admin/users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  public async delete(@Request() req, @Param('id') id: number): Promise<any> {
    return this.service.delete(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-info')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'NO CONTENT' })
  public async updateUserInfo(@Request() req, @Body() data: UpdateUserDto) {
    return await this.service.updateUser(req.user, data);
  }
}
