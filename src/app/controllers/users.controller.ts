/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HttpExceptionFilter,
  error_400,
  error_401,
  error_403,
  error_500,
} from '../statics/filters/exceptions.filter';
import { DosenDTO } from '../dtos/dosen.dto';
import { AuthGuard } from '../middlewares/guard/auth.guard';
import { DosenService } from 'src/domain/services/dosen.service';
import { CreateDosen } from 'src/infra/models/dosen.model';
import { UsersService } from 'src/domain/services/users.service';
import { UsersModelUpdate } from 'src/infra/models/users.model';

@ApiTags('Users')
@Controller('users')
@ApiResponse({
  status: 500,
  schema: { type: 'object', properties: error_500 },
})
@ApiResponse({
  status: 401,
  schema: { type: 'object', properties: error_401 },
})
@ApiResponse({
  status: 403,
  schema: { type: 'object', properties: error_403 },
})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Put('update/:username')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('username') username: string, @Body() body: UsersModelUpdate) {
    try {
      return await this.usersService.update(body, username);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('me/:username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  async findOne(@Param('username') username: string) {
    try {
      return await this.usersService.findOne(username);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
