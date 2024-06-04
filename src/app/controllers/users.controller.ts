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
  Req,
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
import { AuthGuard } from 'src/app/middlewares/guard/auth.guard';
import { UsersService } from 'src/domain/services/users.service';
import { UsersModelUpdate } from 'src/infra/models/users.model';
import { Request } from 'express';

@Controller('users')
@ApiTags('Users')
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

  @Put('profile/update')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Body() body: UsersModelUpdate, @Req() request: Request) {
    try {
      return await this.usersService.update(body, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  async getUsers(@Req() request: Request) {
    try {
      return await this.usersService.findOne(request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
