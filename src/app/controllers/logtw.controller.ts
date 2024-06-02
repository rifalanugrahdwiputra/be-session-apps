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
import { LogTwService } from 'src/domain/services/logtw.service';
import { CreateLogTw } from 'src/infra/models/logtw.model';
import { LogTwDTO } from '../dtos/LogTw.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('logtw')
@ApiTags('logtw')
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
export class LogTwController {
  constructor(private readonly logTwService: LogTwService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('create')
  @HttpCode(201)
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreateLogTw): Promise<{ message: string }> {
    try {
      return await this.logTwService.create(body);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('update/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Body() body: CreateLogTw) {
    try {
      return await this.logTwService.update(body, id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiQuery({ name: 'user', required: false })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'include_inactive', required: false, example: false })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'user' })
  @ApiQuery({ name: 'orderBy', required: false, example: 'DESC' })
  @UseFilters(new HttpExceptionFilter())
  async findAll(@Query() query: LogTwDTO) {
    try {
      return await this.logTwService.all(query);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('get/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  async findOne(@Param('id') id: number) {
    try {
      return await this.logTwService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  async deleteByid(@Param('id') id: number) {
    try {
      return await this.logTwService.deleteById(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
